import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { VpcStack } from './vpc';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { SecurityGroup, Peer, Port } from 'aws-cdk-lib/aws-ec2';
import * as dotenv from 'dotenv';
import * as cognito from 'aws-cdk-lib/aws-cognito';

dotenv.config();
const REGION = process.env.CDK_DEFAULT_REGION ? process.env.CDK_DEFAULT_REGION : 'ap-northeast-1';


export class FargateStack extends Stack {
  constructor(scope: Construct, id: string, vpcStack: VpcStack, props?: StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'userPool', {
      userPoolName: 'userPool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
    });

    const userPoolClient = userPool.addClient('userPoolClient', {
        userPoolClientName: 'userPoolClient',
        generateSecret: true,
        oAuth: {
          callbackUrls: ['http://localhost:3000/api/auth/callback/cognito'],
          logoutUrls: ['http://localhost:3000/'],
          flows: { authorizationCodeGrant: true },
          scopes: [
            cognito.OAuthScope.EMAIL,
            cognito.OAuthScope.PROFILE,
            cognito.OAuthScope.OPENID,
          ],
        },
      });

    userPool.addDomain('userPoolDomain', {
        cognitoDomain: { domainPrefix: 'uniqdomain' },
      });

    // Create IAM Role for ECS Tasks
    const ecsTaskRole = new Role(this, 'EcsTaskRole', {
        assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
        });
    
    // Attach policies to the role
    ecsTaskRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'));
    ecsTaskRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));
    ecsTaskRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess'));
    ecsTaskRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonCognitoPowerUser'));
    ecsTaskRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));
    ecsTaskRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));

    // Create ECS Cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: vpcStack.vpc,
    });

    // Create Fargate Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'Task', {
      memoryLimitMiB: 3072,
      cpu: 1024,
      taskRole: ecsTaskRole,
    });

    // Create Docker image
    const dockerImage = new DockerImageAsset(this, 'DockerImage', {
        directory: path.join(__dirname, '../../../api'), // replace with the path to your Dockerfile
      });


    // Add Container to Task Definition
    const container = taskDefinition.addContainer('AppContainer', {
    // image: ecs.ContainerImage.fromEcrRepository(dockerImage.repository), // Use image from DockerImageAsset
    // image: ecs.ContainerImage.fromAsset('../api'),
    image: ecs.ContainerImage.fromDockerImageAsset(dockerImage),
    logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'AppContainer' }),
    environment: {
        REGION: REGION,
        USERPOOLID: userPool.userPoolId,
        APPCLIENTID: userPoolClient.userPoolClientId,
    },
    });

    // Add Port Mapping to Container
    container.addPortMappings({
      containerPort: 3333,
      protocol: ecs.Protocol.TCP,
    });

    // Create Security Group in FargateStack
    const fargateSecurityGroup = new SecurityGroup(this, 'FargateSecurityGroup', {
        vpc: vpcStack.vpc,
        allowAllOutbound: true,
        });
    
    // Allow inbound traffic on port 80
    fargateSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(3333));

    // Create Fargate Service
    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster,
      taskDefinition,
      securityGroups: [fargateSecurityGroup],
      publicLoadBalancer: true,
    });

    service.targetGroup.configureHealthCheck({
        path: "/health", // ヘルスチェックのパスを"/health"に設定
        interval: Duration.seconds(15), // ヘルスチェックの間隔を15秒に設定
      });
  }
}
