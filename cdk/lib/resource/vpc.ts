import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc, SubnetType, SecurityGroup, Port, Peer } from 'aws-cdk-lib/aws-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';

export class VpcStack extends Stack {
  public readonly vpc: Vpc;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create VPC
    this.vpc = new Vpc(this, 'MyVPC', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Ingress',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Application',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    new ec2.InterfaceVpcEndpoint(this, 'ECRVpcEndpoint', {
        vpc: this.vpc,
        service: ec2.InterfaceVpcEndpointAwsService.ECR,
        privateDnsEnabled: true
      })

    new ec2.InterfaceVpcEndpoint(this, 'ECRDockerVpcEndpoint', {
        vpc: this.vpc,
        service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
        privateDnsEnabled: true
    })
    
    new ec2.GatewayVpcEndpoint(this, 'S3GatewayEndpoint', {
    service: ec2.GatewayVpcEndpointAwsService.S3,
    vpc: this.vpc,
    subnets: [{ subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS }]
    })
    
    // access Cloudwatch logging
    new ec2.InterfaceVpcEndpoint(this, 'CloudWatchLogsVpcEndpoint', {
    vpc: this.vpc,
    service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    privateDnsEnabled: true
    })

  }
}

