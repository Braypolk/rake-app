# Everything to start
- start rancher desktop
- minikube start --extra-config "apiserver.cors-allowed-origins=["http://\*"]"
- kubectl proxy
- (might have to gcloud auth application-default login)
- yarn dev

easy view cluster resources with k9s


make sure it's pointing to the correct python file (should probably change that to just be js, but idk)


kube-api route for crossplane resources
http://localhost:8001/apis/storage.gcp.upbound.io/v1beta1


# Next step
- get import and export working so I can save and load state