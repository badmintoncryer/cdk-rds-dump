# Under construction!!!!!!!
# cdk-rds-dump
CDK constructs that dump the contents of AWS RDS, generate SQL files, and save them to S3

# Welcome to your CDK TypeScript Construct Library project

You should explore the contents of this project. It demonstrates a CDK Construct Library that includes a construct (`CdkRdsDump`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The construct defines an interface (`CdkRdsDumpProps`) to configure the visibility timeout of the queue.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests

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
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.createSecretsManagerVPCEndpoint">createSecretsManagerVPCEndpoint</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.databaseName">databaseName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.dbEngine">dbEngine</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.rdsCluster">rdsCluster</a></code> | <code>aws-cdk-lib.aws_rds.DatabaseCluster</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.idSuffix">idSuffix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.lambdaEnv">lambdaEnv</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.lambdaNsg">lambdaNsg</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.secretId">secretId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.secretsManagerVPCEndpointNsgId">secretsManagerVPCEndpointNsgId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.unsecurePassword">unsecurePassword</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-rds-dump.RdsDumpProps.property.unsecureUserName">unsecureUserName</a></code> | <code>string</code> | *No description.* |

---

##### `createSecretsManagerVPCEndpoint`<sup>Required</sup> <a name="createSecretsManagerVPCEndpoint" id="cdk-rds-dump.RdsDumpProps.property.createSecretsManagerVPCEndpoint"></a>

```typescript
public readonly createSecretsManagerVPCEndpoint: boolean;
```

- *Type:* boolean

---

##### `databaseName`<sup>Required</sup> <a name="databaseName" id="cdk-rds-dump.RdsDumpProps.property.databaseName"></a>

```typescript
public readonly databaseName: string;
```

- *Type:* string

---

##### `dbEngine`<sup>Required</sup> <a name="dbEngine" id="cdk-rds-dump.RdsDumpProps.property.dbEngine"></a>

```typescript
public readonly dbEngine: string;
```

- *Type:* string

---

##### `rdsCluster`<sup>Required</sup> <a name="rdsCluster" id="cdk-rds-dump.RdsDumpProps.property.rdsCluster"></a>

```typescript
public readonly rdsCluster: DatabaseCluster;
```

- *Type:* aws-cdk-lib.aws_rds.DatabaseCluster

---

##### `schedule`<sup>Required</sup> <a name="schedule" id="cdk-rds-dump.RdsDumpProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule

---

##### `idSuffix`<sup>Optional</sup> <a name="idSuffix" id="cdk-rds-dump.RdsDumpProps.property.idSuffix"></a>

```typescript
public readonly idSuffix: string;
```

- *Type:* string

---

##### `lambdaEnv`<sup>Optional</sup> <a name="lambdaEnv" id="cdk-rds-dump.RdsDumpProps.property.lambdaEnv"></a>

```typescript
public readonly lambdaEnv: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `lambdaNsg`<sup>Optional</sup> <a name="lambdaNsg" id="cdk-rds-dump.RdsDumpProps.property.lambdaNsg"></a>

```typescript
public readonly lambdaNsg: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `secretId`<sup>Optional</sup> <a name="secretId" id="cdk-rds-dump.RdsDumpProps.property.secretId"></a>

```typescript
public readonly secretId: string;
```

- *Type:* string

---

##### `secretsManagerVPCEndpointNsgId`<sup>Optional</sup> <a name="secretsManagerVPCEndpointNsgId" id="cdk-rds-dump.RdsDumpProps.property.secretsManagerVPCEndpointNsgId"></a>

```typescript
public readonly secretsManagerVPCEndpointNsgId: string;
```

- *Type:* string

---

##### `unsecurePassword`<sup>Optional</sup> <a name="unsecurePassword" id="cdk-rds-dump.RdsDumpProps.property.unsecurePassword"></a>

```typescript
public readonly unsecurePassword: string;
```

- *Type:* string

---

##### `unsecureUserName`<sup>Optional</sup> <a name="unsecureUserName" id="cdk-rds-dump.RdsDumpProps.property.unsecureUserName"></a>

```typescript
public readonly unsecureUserName: string;
```

- *Type:* string

---



