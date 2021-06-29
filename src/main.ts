/* Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

import * as core from '@actions/core';
import * as artifacts from 'oci-artifacts';
import * as identity from 'oci-identity';
import common = require('oci-common');

async function getOcirRepo(): Promise<void> {
  const cp = new common.ConfigFileAuthenticationDetailsProvider(process.env.OCI_CLI_CONFIG_FILE);
  const ac = new artifacts.ArtifactsClient({authenticationDetailsProvider: cp});
  const ic = new identity.IdentityClient({authenticationDetailsProvider: cp});

  const compartmentId: string = core.getInput('compartment', {required: true});
  const displayName: string = core.getInput('name', {required: true});

  const namespace = (await ac.getContainerConfiguration({compartmentId: compartmentId})).containerConfiguration
    .namespace;
  const regionCode = (await ic.listRegions({})).items
    .find(x => x.name === cp.getRegion().regionId)
    ?.key?.toLocaleLowerCase();
  const ocir = regionCode ? `${regionCode}.ocir.io` : '';

  if (ocir) {
    const repo = (
      await ac.listContainerRepositories({compartmentId: compartmentId})
    ).containerRepositoryCollection.items.find(x => x.displayName === displayName);

    if (repo) {
      core.setOutput('repo_path', `${ocir}/${namespace}/${repo.displayName}`);
      core.setOutput('repo_ocid', `${repo.id}`);
    } else {
      const containerRepository = (
        await ac.createContainerRepository({
          createContainerRepositoryDetails: {
            compartmentId: compartmentId,
            displayName: displayName,
            isImmutable: false,
            isPublic: false
          }
        })
      ).containerRepository;
      core.setOutput('repo_path', `${ocir}/${namespace}/${containerRepository.displayName}`);
      core.setOutput('repo_ocid', `${containerRepository.id}`);
    }
  } else {
    core.setFailed('Failed to identify OCIR endpoint.');
  }
}

getOcirRepo().catch(e => {
  if (e instanceof Error) core.setFailed(e.message);
});
