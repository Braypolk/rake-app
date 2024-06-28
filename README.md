# Deploy gcp resources through a visual canvas

[overview landing site](https://rake-landing-eight.vercel.app/)

## Everything to start
- start rancher desktop
- minikube start --extra-config "apiserver.cors-allowed-origins=["http://\*"]" --profile management --kubernetes-version=v1.28.4
- kubectl proxy
- (might have to gcloud auth application-default login)
- pn dev

easy view cluster resources with k9s


make sure it's pointing to the correct python file (should probably change that to just be js, but idk)


kube-api route for crossplane resources
http://localhost:8001/apis/storage.gcp.upbound.io/v1beta1


[splitpanes](https://orefalo.github.io/svelte-splitpanes/examples/styling/splitters)


cool stuff: [svelte-command-pallate](https://svelte-command-palette.vercel.app/)


[var ui](https://dribbble.com/shots/19103275-Automated-emailing-system-with-variables)