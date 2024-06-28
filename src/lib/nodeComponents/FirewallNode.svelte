<script>
  import NodeTemplate from "$lib/nodeComponents/NodeTemplate.svelte";
  import { firewallData } from "$lib/nodeComponents/nodeData";
  export let data = firewallData;
</script>

<NodeTemplate type="Firewall" provider="compute" id={data.id}>
  <div class="property">
    <span class="property-allowed">allowed</span>
    <span
      class="info-icon"
      title="Allowed: The list of ALLOW rules specified by this firewall. Each rule specifies a protocol and port-range tuple that describes a permitted connection."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.allowed = evt.target?.value;
      }}
      value={data.allowed}
    />
  </div>

  <div class="property">
    <span class="property-denied">denied</span>
    <span
      class="info-icon"
      title="Denied: The list of DENY rules specified by this firewall. Each rule specifies a protocol and port-range tuple that describes a denied connection."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.denied = evt.target?.value;
      }}
      value={data.denied}
    />
  </div>

  <div class="property">
    <span class="property-description">description</span>
    <span
      class="info-icon"
      title="Description: An optional description of this resource. Provide this field when you create the resource."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.description = evt.target?.value;
      }}
      value={data.description}
    />
  </div>

  <div class="property">
    <span class="property-destinationRanges">destinationRanges</span>
    <span
      class="info-icon"
      title="DestinationRanges: If destination ranges are specified, the firewall rule applies only to traffic that has destination IP address in these ranges. These ranges must be expressed in CIDR format. Only IPv4 is supported."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.destinationRanges = evt.target?.value;
      }}
      value={data.destinationRanges}
    />
  </div>

  <div class="property">
    <span class="property-direction">direction</span>
    <span
      class="info-icon"
      title="Direction: Direction of traffic to which this firewall applies, either `INGRESS` or `EGRESS`. The default is `INGRESS`. For `INGRESS` traffic, you cannot specify the destinationRanges field, and for `EGRESS` traffic, you cannot specify the sourceRanges or sourceTags fields. 
 Possible values: 'EGRESS' 'INGRESS'">ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.direction = evt.target?.value;
      }}
      value={data.direction}
    />
  </div>

  <div class="property">
    <span class="property-disabled">disabled</span>
    <span
      class="info-icon"
      title="Disabled: Denotes whether the firewall rule is disabled. When set to true, the firewall rule is not enforced and the network behaves as if it did not exist. If this is unspecified, the firewall rule will be enabled."
      >ℹ</span
    >
    <input
      type="checkbox"
      name="disabledState"
      on:change={(evt) => {
        data.disabled = evt.target?.checked;
      }}
    />
  </div>

  <div class="property">
    <span class="property-logConfig">logConfig</span>
    <span
      class="info-icon"
      title="LogConfig: This field denotes the logging options for a particular firewall rule. If logging is enabled, logs will be exported to Stackdriver."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.logConfig = evt.target?.value;
      }}
      value={data.logConfig}
    />
  </div>

  <div class="property">
    <span class="property-network">network</span>
    <span
      class="info-icon"
      title="Network: URL of the network resource for this firewall rule. If not specified when creating a firewall rule, the default network is used: global/networks/default If you choose to specify this field, you can specify the network as a full or partial URL. For example, the following are all valid URLs: 
 - https://www.googleapis.com/compute/v1/projects/myproject/global/networks/my-network - projects/myproject/global/networks/my-network - global/networks/default"
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.network = evt.target?.value;
      }}
      value={data.network}
    />
  </div>

  <div class="property">
    <span class="property-networkRef">networkRef</span>
    <span
      class="info-icon"
      title="NetworkRef references a Network and retrieves its URI">ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.networkRef = evt.target?.value;
      }}
      value={data.networkRef}
    />
  </div>

  <div class="property">
    <span class="property-networkSelector">networkSelector</span>
    <span
      class="info-icon"
      title="NetworkSelector selects a reference to a Network">ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.networkSelector = evt.target?.value;
      }}
      value={data.networkSelector}
    />
  </div>

  <div class="property">
    <span class="property-priority">priority</span>
    <span
      class="info-icon"
      title="Priority: Priority for this rule. This is an integer between `0` and `65535`, both inclusive. The default value is `1000`. Relative priorities determine which rule takes effect if multiple rules apply. Lower values indicate higher priority. For example, a rule with priority `0` has higher precedence than a rule with priority `1`. DENY rules take precedence over ALLOW rules if they have equal priority. Note that VPC networks have implied rules with a priority of `65535`. To avoid conflicts with the implied rules, use a priority number less than `65535`."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.priority = evt.target?.value;
      }}
      value={data.priority}
    />
  </div>

  <div class="property">
    <span class="property-sourceRanges">sourceRanges</span>
    <span
      class="info-icon"
      title="SourceRanges: If source ranges are specified, the firewall rule applies only to traffic that has a source IP address in these ranges. These ranges must be expressed in CIDR format. One or both of sourceRanges and sourceTags may be set. If both fields are set, the rule applies to traffic that has a source IP address within sourceRanges OR a source IP from a resource with a matching tag listed in the sourceTags field. The connection does not need to match both fields for the rule to apply. Only IPv4 is supported."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.sourceRanges = evt.target?.value;
      }}
      value={data.sourceRanges}
    />
  </div>

  <div class="property">
    <span class="property-sourceServiceAccounts">sourceServiceAccounts</span>
    <span
      class="info-icon"
      title="SourceServiceAccounts: If source service accounts are specified, the firewall rules apply only to traffic originating from an instance with a service account in this list. Source service accounts cannot be used to control traffic to an instance's external IP address because service accounts are associated with an instance, not an IP address. sourceRanges can be set at the same time as sourceServiceAccounts. If both are set, the firewall applies to traffic that has a source IP address within the sourceRanges OR a source IP that belongs to an instance with service account listed in sourceServiceAccount. The connection does not need to match both fields for the firewall to apply. sourceServiceAccounts cannot be used at the same time as sourceTags or targetTags."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.sourceServiceAccounts = evt.target?.value;
      }}
      value={data.sourceServiceAccounts}
    />
  </div>

  <div class="property">
    <span class="property-sourceTags">sourceTags</span>
    <span
      class="info-icon"
      title="SourceTags: If source tags are specified, the firewall rule applies only to traffic with source IPs that match the primary network interfaces of VM instances that have the tag and are in the same VPC network. Source tags cannot be used to control traffic to an instance's external IP address, it only applies to traffic between instances in the same virtual network. Because tags are associated with instances, not IP addresses. One or both of sourceRanges and sourceTags may be set. If both fields are set, the firewall applies to traffic that has a source IP address within sourceRanges OR a source IP from a resource with a matching tag listed in the sourceTags field. The connection does not need to match both fields for the firewall to apply."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.sourceTags = evt.target?.value;
      }}
      value={data.sourceTags}
    />
  </div>

  <div class="property">
    <span class="property-targetServiceAccounts">targetServiceAccounts</span>
    <span
      class="info-icon"
      title="TargetServiceAccounts: A list of service accounts indicating sets of instances located in the network that may make network connections as specified in allowed[]. targetServiceAccounts cannot be used at the same time as targetTags or sourceTags. If neither targetServiceAccounts nor targetTags are specified, the firewall rule applies to all instances on the specified network."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.targetServiceAccounts = evt.target?.value;
      }}
      value={data.targetServiceAccounts}
    />
  </div>

  <div class="property">
    <span class="property-targetTags">targetTags</span>
    <span
      class="info-icon"
      title="TargetTags: A list of tags that controls which instances the firewall rule applies to. If targetTags are specified, then the firewall rule applies only to instances in the VPC network that have one of those tags. If no targetTags are specified, the firewall rule applies to all instances on the specified network."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.targetTags = evt.target?.value;
      }}
      value={data.targetTags}
    />
  </div>
</NodeTemplate>

<style>
  :global(.svelte-flow__node-Firewall) {
    background-color: rgba(131, 131, 131, 0.539);
    border: 3px solid rgb(200, 200, 200);
    border-radius: 1rem;
  }
  .info-icon {
    /* Your CSS styles */
    cursor: help; /* Change the cursor to indicate hoverable */
  }
</style>
