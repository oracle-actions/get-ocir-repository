# get-ocir-repository

Use this GitHub Action to return the OCID and full URI for the specified Oracle Cloud Infrastructure Registry (OCIR)
repository. If the repository does not exist, it will be created automatically.

## Required environment variables

The following [OCI CLI environment variables][1] must be defined:

- `OCI_CLI_USER`
- `OCI_CLI_TENANCY`
- `OCI_CLI_FINGERPRINT`
- `OCI_CLI_KEY_CONTENT`
- `OCI_CLI_REGION`

We recommend using GitHub Secrets to store these values. If you have more than one step or workflow that requires these
values, consider [defining your environment variables][2] at the job or workflow level.

## Inputs

- `name`: the name of the repository
- `compartment`: the OCID of the compartment in which to search for or create the repository

## Outputs

- `repo_ocid`: The OCID of the repository
- `repo_path`: The full URI to the repository to be consumed directly by Docker or Podman.

## Sample workflow

This sample workflow will either create a repository named `oraclelinux` in the `OCI_COMPARTMENT_OCID` compartment or
retrieve the path of an existing `oraclelinux` repository. The `repo_path` is then used by the `tag-and-push-image`
step as the target image repository for the `docker push` command.

This example also uses the [`login-ocir`][3] action which provides a simple mechanism for logging into OCIR using an
auth token.

```yaml
jobs:
  get-ocir-repository-test:
    runs-on: ubuntu-22.04 Test
    env:
      OCI_CLI_USER: ${{ secrets.OCI_CLI_USER }}
      OCI_CLI_TENANCY: ${{ secrets.OCI_CLI_TENANCY }}
      OCI_CLI_FINGERPRINT: ${{ secrets.OCI_CLI_FINGERPRINT }}
      OCI_CLI_KEY_CONTENT: ${{ secrets.OCI_CLI_KEY_CONTENT }}
      OCI_CLI_REGION: ${{ secrets.OCI_CLI_REGION }}
    steps:
      - name: Get or create an OCIR Repository
        uses: oracle-actions/get-ocir-repository@v1.3.0
        id: get-ocir-repository
        with:
          name: oraclelinux
          compartment: ${{ secrets.OCI_COMPARTMENT_OCID }}

      - name: Log into OCIR
        uses: oracle-actions/login-ocir@v1.3.0
        id: login-ocir
        with:
          auth_token: ${{ secrets.OCI_AUTH_TOKEN }}

      - name: Tag and push a container image
        id: tag-and-push-image
        run: |
          docker pull oraclelinux:8-slim
          docker tag "oraclelinux:8-slim" "${{ steps.get-ocir-repository.outputs.repo_path }}:8-slim"
          docker push "${{ steps.get-ocir-repository.outputs.repo_path }}:8-slim"
```

See [`action.yml`](./action.yml) for more details.

## Contributing

We welcome contributions from the community. Before submitting a pull request, please
[review our contribution guide](./CONTRIBUTING.md).

## Security

Please consult the [security guide](./SECURITY.md) for our responsible security vulnerability disclosure process.

## License

Copyright (c) 2022, 2024 Oracle and/or its affiliates.

Released under the Universal Permissive License v1.0 as shown at <https://oss.oracle.com/licenses/upl/>.

[1]: https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/clienvironmentvariables.htm
[2]: https://docs.github.com/en/actions/learn-github-actions/environment-variables
[3]: https://github.com/oracle-actions/login-ocir
