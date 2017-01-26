# Coliselia

[![Build Status](https://travis-ci.org/siggame/coliselia.svg?branch=master)](https://travis-ci.org/siggame/coliselia) 

### Setup coliselia
1) Install Docker - https://docs.docker.com/engine/installation/linux/ubuntulinux/  
```curl -sSL https://get.docker.com/ | sh```  
 
2) Install Docker Compose - https://docs.docker.com/compose/install/  
`pip install docker-compose`  

3) Run `npm install` on each service using setupAll script  
`./setupAll.sh`  

### Run coliselia  
4) Build images  
`docker-compose build`  

5) Run images  
`docker-compose up`    

[Coliselia Design & Interactions](https://docs.google.com/drawings/d/101-QUMbFKBXXyhxuEFta0f9ZmxD309IAI1K4JHHEH4c/edit?usp=sharing)
![ophelia & colisee interactions](https://docs.google.com/drawings/d/101-QUMbFKBXXyhxuEFta0f9ZmxD309IAI1K4JHHEH4c/pub?w=960&h=720)




[Database](dbapi/README.md)

### Vagrant Usage
Because most of this will be running on servers / AWS / Google Cloud, the target environment is Linux. Some devs do not have immediate access to a Linux machine nor do they want to use VirtualBox traditionally.

Vagrant is basically a virtual machine that allows easy command line access and automatically sets up a shared folder in the working directory. This means any running & execution can take place in the virtual machine; while still being able to use your own computer's editors.

1. Install VirtualBox
2. Install Vagrant
3. Navigate to the project root (where the Vagrantfile is)
4. Run `vagrant up` to setup the virtual image
5. Run `vagrant ssh` to ssh into the newly created virtual image
