```mermaid
flowchart LR

subgraph "AWS Cloud"
    subgraph "Region"
        subgraph "VPC"
            subgraph "Public subnet"
                AWS_ALB[ALB]
            end
            subgraph "Private subnet"
                AWS_EC2[EC2]
            end
        end
    end
    subgraph "S3"
        AWS_S3[S3]
    end
end

subgraph "AWS外部の外部要素"
    user[ユーザー]
end

subgraph "Region"
    AWS_CF[CloudFront]
end

AWS_CF --> AWS_ALB
AWS_ALB --> AWS_EC2
AWS_EC2 --> AWS_RDS[RDS]
AWS_S3 --> AWS_CF

