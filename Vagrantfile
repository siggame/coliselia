# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

    config.vm.box = "ubuntu/xenial64"

    # Create a forwarded port mapping which allows access to a specific port
    # within the machine from a port on the host machine. In the example below,
    # accessing "localhost:8080" will access port 80 on the guest machine.
    # config.vm.network "forwarded_port", guest: 80, host: 8080

    # Root configuration
    config.vm.provision "shell", inline: <<-SHELL
        apt-get update
        apt-get install -y make gcc tmux vim

        echo "#### Installing docker..."
            apt-get install -y apt-transport-https ca-certificates
            apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
            REPO="deb https://apt.dockerproject.org/repo ubuntu-xenial main"
            echo "${REPO}" | sudo tee /etc/apt/sources.list.d/docker.list
            apt-get update
            apt-get install -y linux-image-extra-$(uname -r) linux-image-extra-virtual docker-engine
            usermod -aG docker ubuntu

        echo "#### Installing Kubernetes..."
            wget https://storage.googleapis.com/kubernetes-release/release/v1.4.4/bin/linux/amd64/kubectl
            chmod +x kubectl
            mv kubectl /usr/local/bin/kubectl
    SHELL

    # User configuration
    config.vm.provision "shell", privileged: false, inline: <<-SHELL
        ln -s /vagrant/ workspace
        echo "#### Installing NVM..."
            wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    SHELL
end
