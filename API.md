# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### RdsDump <a name="RdsDump" id="cdk-rds-dump.RdsDump"></a>

#### Initializers <a name="Initializers" id="cdk-rds-dump.RdsDump.Initializer"></a>

```typescript
import { RdsDump } from 'cdk-rds-dump'

new RdsDump(scope: Construct, id: string, __2: RdsDumpProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-rds-dump.RdsDump.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDump.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDump.Initializer.parameter.__2">__2</a></code> | <code><a href="#cdk-rds-dump.RdsDumpProps">RdsDumpProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-rds-dump.RdsDump.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-rds-dump.RdsDump.Initializer.parameter.id"></a>

- *Type:* string

---

##### `__2`<sup>Required</sup> <a name="__2" id="cdk-rds-dump.RdsDump.Initializer.parameter.__2"></a>

- *Type:* <a href="#cdk-rds-dump.RdsDumpProps">RdsDumpProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-rds-dump.RdsDump.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-rds-dump.RdsDump.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-rds-dump.RdsDump.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-rds-dump.RdsDump.isConstruct"></a>

```typescript
import { RdsDump } from 'cdk-rds-dump'

RdsDump.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-rds-dump.RdsDump.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-rds-dump.RdsDump.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-rds-dump.RdsDump.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### RdsDumpProps <a name="RdsDumpProps" id="cdk-rds-dump.RdsDumpProps"></a>

#### Initializer <a name="Initializer" id="cdk-rds-dump.RdsDumpProps.Initializer"></a>

```typescript
import { RdsDumpProps } from 'cdk-rds-dump'

const rdsDumpProps: RdsDumpProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.databaseName">databaseName</a></code> | <code>string</code> | Database name to dump. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.dbEngine">dbEngine</a></code> | <code><a href="#cdk-rds-dump.DbEngine">DbEngine</a></code> | Select DB engine type. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.rdsCluster">rdsCluster</a></code> | <code>aws-cdk-lib.aws_rds.DatabaseCluster</code> | RDS Cluster to dump. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | Schedule to dump. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.createS3GatewayEndpoint">createS3GatewayEndpoint</a></code> | <code>boolean</code> | Whether to create an S3 Gateway Endpoint for the VPC where the RDS is located. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.createSecretsManagerVPCEndpoint">createSecretsManagerVPCEndpoint</a></code> | <code>boolean</code> | Whether to create an Interface Endpoint for the Secrets Manager. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.idSuffix">idSuffix</a></code> | <code>string</code> | Suffix to add to the resource ID. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.lambdaEnv">lambdaEnv</a></code> | <code>{[ key: string ]: string}</code> | Environment variables to set in the lambda function. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.lambdaNsg">lambdaNsg</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | Security group to allow access to the lambda function. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.memorySize">memorySize</a></code> | <code>number</code> | The amount of memory in MB allocated to the Lambda function. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.secretId">secretId</a></code> | <code>string</code> | Secret id for database connection information stored in the Secrets Manager. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.secretsManagerVPCEndpointNsgId">secretsManagerVPCEndpointNsgId</a></code> | <code>string</code> | List of IDs of security groups to attach to the Interface Endpoint for Secrets Manager. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.unsecurePassword">unsecurePassword</a></code> | <code>string</code> | Database Password. |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.unsecureUserName">unsecureUserName</a></code> | <code>string</code> | Database username. |

---

##### `databaseName`<sup>Required</sup> <a name="databaseName" id="cdk-rds-dump.RdsDumpProps.property.databaseName"></a>

```typescript
public readonly databaseName: string;
```

- *Type:* string

Database name to dump.

---

##### `dbEngine`<sup>Required</sup> <a name="dbEngine" id="cdk-rds-dump.RdsDumpProps.property.dbEngine"></a>

```typescript
public readonly dbEngine: DbEngine;
```

- *Type:* <a href="#cdk-rds-dump.DbEngine">DbEngine</a>

Select DB engine type.

Currently only mysql can be selected.

---

##### `rdsCluster`<sup>Required</sup> <a name="rdsCluster" id="cdk-rds-dump.RdsDumpProps.property.rdsCluster"></a>

```typescript
public readonly rdsCluster: DatabaseCluster;
```

- *Type:* aws-cdk-lib.aws_rds.DatabaseCluster

RDS Cluster to dump.

---

##### `schedule`<sup>Required</sup> <a name="schedule" id="cdk-rds-dump.RdsDumpProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule

Schedule to dump.

See aws-cdk-lib/aws-events.Schedule.
ex.
import * as events from 'aws-cdk-lib/aws-events'
// It is executed daily at 00:00 UTC.
events.Schedule.cron({ minute: "0", hour: "0" })

---

##### `createS3GatewayEndpoint`<sup>Optional</sup> <a name="createS3GatewayEndpoint" id="cdk-rds-dump.RdsDumpProps.property.createS3GatewayEndpoint"></a>

```typescript
public readonly createS3GatewayEndpoint: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to create an S3 Gateway Endpoint for the VPC where the RDS is located.

---

##### `createSecretsManagerVPCEndpoint`<sup>Optional</sup> <a name="createSecretsManagerVPCEndpoint" id="cdk-rds-dump.RdsDumpProps.property.createSecretsManagerVPCEndpoint"></a>

```typescript
public readonly createSecretsManagerVPCEndpoint: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to create an Interface Endpoint for the Secrets Manager.

It is recommended to use a secret stored in the Secrets Manager,
but in that case, the lambda doing the dump needs a route to access the Secrets Manager.
If createSecretsManagerVPCEndpoint is true, an Interface Endpoint is created to allow access to the Secrets Manager.

---

##### `idSuffix`<sup>Optional</sup> <a name="idSuffix" id="cdk-rds-dump.RdsDumpProps.property.idSuffix"></a>

```typescript
public readonly idSuffix: string;
```

- *Type:* string
- *Default:* no suffix

Suffix to add to the resource ID.

---

##### `lambdaEnv`<sup>Optional</sup> <a name="lambdaEnv" id="cdk-rds-dump.RdsDumpProps.property.lambdaEnv"></a>

```typescript
public readonly lambdaEnv: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* no environment variables

Environment variables to set in the lambda function.

ex. { "ENV_VAR": "value" }

---

##### `lambdaNsg`<sup>Optional</sup> <a name="lambdaNsg" id="cdk-rds-dump.RdsDumpProps.property.lambdaNsg"></a>

```typescript
public readonly lambdaNsg: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]
- *Default:* use auto generated security group

Security group to allow access to the lambda function.

---

##### `memorySize`<sup>Optional</sup> <a name="memorySize" id="cdk-rds-dump.RdsDumpProps.property.memorySize"></a>

```typescript
public readonly memorySize: number;
```

- *Type:* number
- *Default:* 1024

The amount of memory in MB allocated to the Lambda function.

---

##### `secretId`<sup>Optional</sup> <a name="secretId" id="cdk-rds-dump.RdsDumpProps.property.secretId"></a>

```typescript
public readonly secretId: string;
```

- *Type:* string
- *Default:* use database cluster's secret

Secret id for database connection information stored in the Secrets Manager.

We recommend using the secret stored in the Secrets Manager as the connection information to the DB,
but it is also possible to specify the user name and password directly.
If secretId is set, the corresponding secret on SecretsManager is retrieved to access the DB.

---

##### `secretsManagerVPCEndpointNsgId`<sup>Optional</sup> <a name="secretsManagerVPCEndpointNsgId" id="cdk-rds-dump.RdsDumpProps.property.secretsManagerVPCEndpointNsgId"></a>

```typescript
public readonly secretsManagerVPCEndpointNsgId: string;
```

- *Type:* string
- *Default:* use auto generated security group

List of IDs of security groups to attach to the Interface Endpoint for Secrets Manager.

Only used if createSecretsManagerVPCEndpoint is true.

---

##### `unsecurePassword`<sup>Optional</sup> <a name="unsecurePassword" id="cdk-rds-dump.RdsDumpProps.property.unsecurePassword"></a>

```typescript
public readonly unsecurePassword: string;
```

- *Type:* string
- *Default:* do not use unsecurePassword

Database Password.

We recommend using the secret stored in the Secrets Manager as the connection information to the DB,
but it is also possible to specify the user name and password directly.
unsecurePassword is a parameter to pass the password when the `unsecureUsername` is used.

---

##### `unsecureUserName`<sup>Optional</sup> <a name="unsecureUserName" id="cdk-rds-dump.RdsDumpProps.property.unsecureUserName"></a>

```typescript
public readonly unsecureUserName: string;
```

- *Type:* string
- *Default:* do not use unsecureUserName

Database username.

We recommend using the secret stored in the Secrets Manager as the connection information to the DB,
but it is also possible to specify the user name and password directly.
unsecureUserName is a parameter to pass the user name when the `unsecurePassword` is used.

---



## Enums <a name="Enums" id="Enums"></a>

### DbEngine <a name="DbEngine" id="cdk-rds-dump.DbEngine"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-rds-dump.DbEngine.MYSQL">MYSQL</a></code> | *No description.* |

---

##### `MYSQL` <a name="MYSQL" id="cdk-rds-dump.DbEngine.MYSQL"></a>

---

