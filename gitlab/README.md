# GitLab Docker Image

### Initializing from Backup

Currently, the gitlab image will restore from the most recent backup available in the `restore/backups.tar.gz` archive.

(**NOTE**: `docker-compose build` must be run to have the backups made available to the image)

This is accomplished via the `flash-forward.sh` script which is located in `restore`. The `flash-forward.sh` script is executed after gitlab has been able to `reconfigure` (effectively meaning that all changes in `gitlab.rb` have been applied successfully). After the backup has been restored, gitlab will have certain accounts already provisioned for testing purposes.

### Generating a New Backup

After initializing the gitlab container through `docker-compose up` it is possible to generate a new backup using the `backup.sh` script. The output of this script will be a `backups.tar.gz` archive found in `restore`.

(**NOTE**: This operation will overwrite a previous `backups.tar.gz` archive)

### Applying Backup with Live Container

After initializing the gitlab container through `docker-compose up` it is possible to apply a specfic backup to the live container via the `apply-backup.sh` script. This will allow you to choose a backup and then add the backup to the container. After which `gitlab-rake` is used to perform the restoration.

### Current Settings

(TODO: Generate `CURRENT.md` when creating a new backup)

See `CURRENT.md` to view the current relevant settings in the gitlab backup.
