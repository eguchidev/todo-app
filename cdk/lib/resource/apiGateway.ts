import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { FargateStack } from './fargate';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, fargateStack: FargateStack, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get the Fargate Service from the Fargate Stack
    const fargateService = fargateStack.node.findChild('Service') as ApplicationLoadBalancedFargateService;

    // Create the API Gateway
    const api = new apigateway.RestApi(this, 'Api', {
      restApiName: 'FargateServiceApi',
      description: 'API Gateway for the Fargate Service',
    });

    // プロキシリソースを作成
    const proxyResource = api.root.addResource('{proxy+}');

    // プロキシリソースにANYメソッドを追加し、HTTPプロキシ統合を設定
    proxyResource.addMethod('ANY', new apigateway.HttpIntegration(`http://${fargateService.loadBalancer.loadBalancerDnsName}/{proxy}`, {
      httpMethod: 'ANY',
      options: {
        integrationResponses: [{
          statusCode: '200'
        }],
        requestParameters: {
          'integration.request.path.proxy': 'method.request.path.proxy'
        }
      },
    }), {
      methodResponses: [{
        statusCode: '200'
      }],
      requestParameters: {
        'method.request.path.proxy': true
      }
    });
  }
    // // Create a new Integration
    // const integration = new apigateway.Integration({
    //   type: apigateway.IntegrationType.HTTP_PROXY,
    //   integrationHttpMethod: 'ANY',
    //   uri: `http://${fargateService.loadBalancer.loadBalancerDnsName}`,
    // });

    // // Create a resource for the API
    // const resource = api.root.addResource('{proxy+}');

    // // Add a method to the resource
    // resource.addMethod('ANY', integration, {
    //   requestParameters: {
    //     'method.request.path.proxy': true,
    //   },
    // });
  }
