import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { VpcStack } from './resource/vpc';
import { FargateStack } from './resource/fargate';
import { ApiGatewayStack } from './resource/apiGateway';
import { DynamoStack } from './resource/dynamo';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpcStack = new VpcStack(this, 'VpcStack');
    const fargateStack = new FargateStack(this, 'FargateStack', vpcStack);
    const apiGatewayStack = new ApiGatewayStack(this, 'ApiGatewayStack', fargateStack);
    const dynamoStack = new DynamoStack(this, 'DynamoStack');
    // fargateStack.addDependency(vpcStack);
  }
}
