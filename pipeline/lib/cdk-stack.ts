import * as cdk from '@aws-cdk/core';
import * as iot from '@aws-cdk/aws-iot';
import { CustomCertificateResource } from "./custom-certificate-resource";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create Device.
     * The PetTrackerThing will receives messages from the tracker device or emulator.
     */
    const trackerThing = new iot.CfnThing(this, "IoTDevice", {
      thingName: "PetTrackerThing"
    });

    const trackerCredentials = new CustomCertificateResource(
      this,
      "PetTrackerCredentials",
      {
        account: this.account,
        stackName: this.stackName,
        thingName: trackerThing.thingName!
      }
    );

    const trackerPolicy = new iot.CfnPolicy(this, "PetTrackerPolicy", {
      policyName: `${trackerThing.thingName}_Policy`,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "iot:*",
            Resource: "*"
          }
        ]
      }
    });
  }
}
