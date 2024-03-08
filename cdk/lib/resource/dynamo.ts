import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';

export class DynamoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'todo',
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
      readCapacity: 1,
      writeCapacity: 1,
    });
  }
}
