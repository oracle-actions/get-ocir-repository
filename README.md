# Get Oracle Cloud Infrastructure Registry Repository URI

Use this GitHub Action to return the OCID and full URI for the specified Oracle
Cloud Infrastructure Registry (OCIR) repository. If the repository does not exist,
it will be created automatically.

## Required environment variables

The following [OCI CLI environment variables][1] must be defined for at least
the `run-oci-cli-command` task:

* `OCI_CLI_USER`
* `OCI_CLI_TENANCY`
* `OCI_CLI_FINGERPRINT`
* `OCI_CLI_KEY_CONTENT`
* `OCI_CLI_REGION`

We recommend using GitHub Secrets to store these values. If you have more than
one tas that requires these values, consider [defining your environment variables][2]
at the job or workflow level.

## Inputs

* `name`: the name of the repository
* `compartment`: the OCID of the compartment in which to search for or create
  the repository

## Outputs

* `repo_ocid`: The OCID of the repository
* `repo_path`: The full URI to the repository. This can be passed directly to
  Docker or Podman.

## Sample workflow

This sample workflow requires the OCID of the compartment to be saved as a
GitHub Secret named `OCI_COMPARTMENT`.

```yaml
jobs:
  my-instances:
    runs-on: ubuntu-latest
    name: List the display name and shape of the instances in my compartment
    steps:
      - name: Configure OCI Credentials
        uses: oracle-actions/configure-oci-credentials@v1
        with:
          user: ${{ secrets.OCI_USER }}
          fingerprint: ${{ secrets.OCI_FINGERPRINT }}
          private_key: ${{ secrets.OCI_PRIVATE_KEY }}
          tenancy: ${{ secrets.OCI_TENANCY }}
          region: 'us-ashburn-1'

      - name: Get private OCIR repository
        uses: oracle-actions/get-ocir-repository@v1.0
        id: get-private-repository
        with:
          compartment: ${{ secrets.OCI_COMPARTMENT }}
          name: 'private-repo'
```

See [`action.yml`](./action.yml) for more details.

## Contributing

We welcome contributions from the community. Before submitting a pull
request, please [review our contribution guide](./CONTRIBUTING.md).

## Security

Please consult the [security guide](./SECURITY.md) for our responsible security
vulnerability disclosure process.

## License

Copyright (c) 2021 Oracle and/or its affiliates.

Released under the Universal Permissive License v1.0 as shown at
<https://oss.oracle.com/licenses/upl/>.

[1]: http://github.com/oracle-actions/configure-oci-credentials
