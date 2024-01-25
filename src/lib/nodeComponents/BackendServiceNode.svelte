<script>
    import NodeTemplate from "$lib/nodeComponents/NodeTemplate.svelte";
    import { backendserviceData } from "$lib/nodeComponents/nodeData";
    export let data = backendserviceData;
</script>

<NodeTemplate type="BackendService" provider="compute" id={data.id}>

    <div class="property">
      <span class="property-affinityCookieTtlSec">affinityCookieTtlSec</span>
      <span class="info-icon" title="Lifetime of cookies in seconds if session_affinity is GENERATED_COOKIE. If set to 0, the cookie is non-persistent and lasts only until the end of the browser session (or equivalent). The maximum allowed value for TTL is one day. When the load balancing scheme is INTERNAL, this field is not used.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.affinityCookieTtlSec = evt.target?.value;}}
        value={data.affinityCookieTtlSec}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-backend">backend</span>
      <span class="info-icon" title="The set of backends that serve this BackendService. Structure is documented below.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.backend = evt.target?.value;}}
        value={data.backend}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-cdnPolicy">cdnPolicy</span>
      <span class="info-icon" title="Cloud CDN configuration for this BackendService. Structure is documented below.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.cdnPolicy = evt.target?.value;}}
        value={data.cdnPolicy}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-circuitBreakers">circuitBreakers</span>
      <span class="info-icon" title="Settings controlling the volume of connections to a backend service. This field is applicable only when the load_balancing_scheme is set to INTERNAL_SELF_MANAGED. Structure is documented below.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.circuitBreakers = evt.target?.value;}}
        value={data.circuitBreakers}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-compressionMode">compressionMode</span>
      <span class="info-icon" title="Compress text responses using Brotli or gzip compression, based on the client's Accept-Encoding header. Possible values are: AUTOMATIC, DISABLED.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.compressionMode = evt.target?.value;}}
        value={data.compressionMode}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-connectionDrainingTimeoutSec">connectionDrainingTimeoutSec</span>
      <span class="info-icon" title="Time for which instance will be drained (not accept new connections, but still work to finish started).">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.connectionDrainingTimeoutSec = evt.target?.value;}}
        value={data.connectionDrainingTimeoutSec}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-consistentHash">consistentHash</span>
      <span class="info-icon" title="Consistent Hash-based load balancing can be used to provide soft session affinity based on HTTP headers, cookies or other properties. This load balancing policy is applicable only for HTTP connections. The affinity to a particular destination host will be lost when one or more hosts are added/removed from the destination service. This field specifies parameters that control consistent hashing. This field only applies if the load_balancing_scheme is set to INTERNAL_SELF_MANAGED. This field is only applicable when locality_lb_policy is set to MAGLEV or RING_HASH. Structure is documented below.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.consistentHash = evt.target?.value;}}
        value={data.consistentHash}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-customRequestHeaders">customRequestHeaders</span>
      <span class="info-icon" title="Headers that the HTTP/S load balancer should add to proxied requests.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.customRequestHeaders = evt.target?.value;}}
        value={data.customRequestHeaders}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-customResponseHeaders">customResponseHeaders</span>
      <span class="info-icon" title="Headers that the HTTP/S load balancer should add to proxied responses.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.customResponseHeaders = evt.target?.value;}}
        value={data.customResponseHeaders}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-description">description</span>
      <span class="info-icon" title="An optional description of this resource.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.description = evt.target?.value;}}
        value={data.description}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-edgeSecurityPolicy">edgeSecurityPolicy</span>
      <span class="info-icon" title="The resource URL for the edge security policy associated with this backend service.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.edgeSecurityPolicy = evt.target?.value;}}
        value={data.edgeSecurityPolicy}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-enableCdn">enableCdn</span>
      <span class="info-icon" title="If true, enable Cloud CDN for this BackendService.">ℹ</span>
      <input
            type="checkbox"
            name="enableCdnState"
            on:change={(evt) => {
                data.enableCdn = evt.target?.checked;
            }}
        />
    </div>
  

    <div class="property">
      <span class="property-healthChecks">healthChecks</span>
      <span class="info-icon" title="The set of URLs to the HttpHealthCheck or HttpsHealthCheck resource for health checking this BackendService. Currently at most one health check can be specified. A health check must be specified unless the backend service uses an internet or serverless NEG as a backend. For internal load balancing, a URL to a HealthCheck resource must be specified instead.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.healthChecks = evt.target?.value;}}
        value={data.healthChecks}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-healthChecksRefs">healthChecksRefs</span>
      <span class="info-icon" title="References to HealthCheck to populate healthChecks.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.healthChecksRefs = evt.target?.value;}}
        value={data.healthChecksRefs}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-healthChecksSelector">healthChecksSelector</span>
      <span class="info-icon" title="Selector for a list of HealthCheck to populate healthChecks.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.healthChecksSelector = evt.target?.value;}}
        value={data.healthChecksSelector}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-iap">iap</span>
      <span class="info-icon" title="Settings for enabling Cloud Identity Aware Proxy Structure is documented below.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.iap = evt.target?.value;}}
        value={data.iap}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-loadBalancingScheme">loadBalancingScheme</span>
      <span class="info-icon" title="Indicates whether the backend service will be used with internal or external load balancing. A backend service created for one type of load balancing cannot be used with the other. For more information, refer to Choosing a load balancer. Default value is EXTERNAL. Possible values are: EXTERNAL, INTERNAL_SELF_MANAGED, EXTERNAL_MANAGED.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.loadBalancingScheme = evt.target?.value;}}
        value={data.loadBalancingScheme}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-localityLbPolicies">localityLbPolicies</span>
      <span class="info-icon" title="A list of locality load balancing policies to be used in order of preference. Either the policy or the customPolicy field should be set. Overrides any value set in the localityLbPolicy field. localityLbPolicies is only supported when the BackendService is referenced by a URL Map that is referenced by a target gRPC proxy that has the validateForProxyless field set to true. Structure is documented below.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.localityLbPolicies = evt.target?.value;}}
        value={data.localityLbPolicies}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-localityLbPolicy">localityLbPolicy</span>
      <span class="info-icon" title="The load balancing algorithm used within the scope of the locality. The possible values are:">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.localityLbPolicy = evt.target?.value;}}
        value={data.localityLbPolicy}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-logConfig">logConfig</span>
      <span class="info-icon" title="This field denotes the logging options for the load balancer traffic served by this backend service. If logging is enabled, logs will be exported to Stackdriver. Structure is documented below.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.logConfig = evt.target?.value;}}
        value={data.logConfig}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-outlierDetection">outlierDetection</span>
      <span class="info-icon" title="Settings controlling eviction of unhealthy hosts from the load balancing pool. This field is applicable only when the load_balancing_scheme is set to INTERNAL_SELF_MANAGED. Structure is documented below.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.outlierDetection = evt.target?.value;}}
        value={data.outlierDetection}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-portName">portName</span>
      <span class="info-icon" title="Name of backend port. The same name should appear in the instance groups referenced by this service. Required when the load balancing scheme is EXTERNAL.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.portName = evt.target?.value;}}
        value={data.portName}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-project">project</span>
      <span class="info-icon" title="The ID of the project in which the resource belongs. If it is not provided, the provider project is used.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.project = evt.target?.value;}}
        value={data.project}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-protocol">protocol</span>
      <span class="info-icon" title="The protocol this BackendService uses to communicate with backends. The default is HTTP. NOTE: HTTP2 is only valid for beta HTTP/2 load balancer types and may result in errors if used with the GA API. Possible values are: HTTP, HTTPS, HTTP2, TCP, SSL, GRPC.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.protocol = evt.target?.value;}}
        value={data.protocol}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-securityPolicy">securityPolicy</span>
      <span class="info-icon" title="The security policy associated with this backend service.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.securityPolicy = evt.target?.value;}}
        value={data.securityPolicy}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-securitySettings">securitySettings</span>
      <span class="info-icon" title="The security settings that apply to this backend service. This field is applicable to either a regional backend service with the service_protocol set to HTTP, HTTPS, or HTTP2, and load_balancing_scheme set to INTERNAL_MANAGED; or a global backend service with the load_balancing_scheme set to INTERNAL_SELF_MANAGED. Structure is documented below.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.securitySettings = evt.target?.value;}}
        value={data.securitySettings}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-sessionAffinity">sessionAffinity</span>
      <span class="info-icon" title="Type of session affinity to use. The default is NONE. Session affinity is not applicable if the protocol is UDP. Possible values are: NONE, CLIENT_IP, CLIENT_IP_PORT_PROTO, CLIENT_IP_PROTO, GENERATED_COOKIE, HEADER_FIELD, HTTP_COOKIE.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.sessionAffinity = evt.target?.value;}}
        value={data.sessionAffinity}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-timeoutSec">timeoutSec</span>
      <span class="info-icon" title="How many seconds to wait for the backend before considering it a failed request. Default is 30 seconds. Valid range is [1, 86400].">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.timeoutSec = evt.target?.value;}}
        value={data.timeoutSec}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  
</NodeTemplate>

<style>
  :global(.svelte-flow__node-BackendService) {
    background-color: rgba(131, 131, 131, 0.539);
    border: 3px solid rgb(200, 200, 200);
    border-radius: 1rem;
  }
  .info-icon {
    /* Your CSS styles */
    cursor: help; /* Change the cursor to indicate hoverable */
  }
</style>