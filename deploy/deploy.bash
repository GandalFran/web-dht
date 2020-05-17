#!/bin/bash

# ================================================== #
# 					constants						 #
# ================================================== #

web_folder="../web"
server_folder="../node_server"

installation_folder="/opt/dht"
final_server_foler="$installation_folder/server"

server_config_file="$server_folder/config.json"
server_config_file_template="$server_folder/template-config.json"


# TODO: don't ever think in changing this constant or you will suffer of covaids
_deploy_folder="../deploy"

# ================================================== #
# 					  utils							 #
# ================================================== #

# ssh utils
gen_key(){
	ssh-keygen -t rsa	
}

share_key(){
	user_host=$1
	ssh-copy-id -i $HOME/.ssh/id_rsa.pub $user_host
}

# basic utils
remote_exec(){
	user_host=$1
	command=$2
	ssh $user_host "$command"
}

copy_file(){
	user_host=$1
	initial=$2
	final=$3
	scp -rq $initial $user_host:$final
}

clean_file(){
	user_host=$1
	file=$2
	remote_exec $user_host "rm -rf $file"
}

# deploy utils
build_web(){
	cd $web_folder
	npm install
	npm audit fix
	npm run build
	cd $_deploy_folder
}

build_server_config(){
	peer=$1
	if [[ -z "$peer" ]]; then
		sed "s/DHT_PEER//g" $server_config_file_template > $server_config_file
	else
		sed "s/DHT_PEER/{\"host\": \"$peer\", \"port\": 5000}/g" $server_config_file_template > $server_config_file
	fi
}

deploy_one_machine(){
	user_host=$1
	bootstrap_peer=$2

	# install pm2
	remote_exec $user_host "npm install -g pm2"

	# prepare folder
	echo "preparing folders ..."
	remote_exec $user_host "mkdir -p $installation_folder"
	remote_exec $user_host "mkdir -p $final_server_foler"

	# prepare web and server configuration
	build_server_config $bootstrap_peer

	# copy server
	echo "installing web and server ..."
	copy_file $user_host "$server_folder/*" "$final_server_foler"
	clean_file $user_host "$final_server_foler/node_modules"

	# build server
	remote_exec $user_host "cd $final_server_foler; npm install"
	remote_exec $user_host "cd $final_server_foler; npm run build"

	# start pm2 services
	echo "configuring pm2 ..."
	remote_exec $user_host "pm2 start $final_server_foler/.build/index.js --log /var/log/dht.log --name dht_server"
}

clean_one_machine(){
	user_host=$1
	# delete from pm2 application and server
	remote_exec $user_host "pm2 delete dht_server"

	# clean instalation folder
	clean_file $user_host "$installation_folder"
}

# ================================================== #
# 					application						 #
# ================================================== #

args=( "$@" )
argsNumber=$#

if [ $argsNumber -eq 0 ]
then
	echo "ERROR: no arguments detected, run deployer.bash -h for help"
fi

for (( i=0; i<$argsNumber; i+=1 ))
do
	selected_command=${args[$i]}
	case $selected_command in
      	"-h") 
        	echo -e "SSDD DHT deployer"
        	echo -e "\t-genkey: generates ssh key"
        	echo -e "\t-newsession <user> <host>: copy ssh key in host"
        	echo -e "\t-deploy <user> <host1> <host2> <host3> : deploys application in the given hosts"
        	echo -e "\t-clean <user> <host1> <host2> <host3> : cleans current deploy"
        	echo -e "\t-h help"
        	echo -e "EXAMPLES"
        	echo -e "\t- generate SSH key and export sessions"
        	echo -e "\t\tbash deploy.bash -genkey -newsession user vm1"
        	echo -e "\t- deploy all"
        	echo -e "\t\tbash deploy.bash -deploy user vm1 vm2 vm3"
        	echo -e "\t- clean current deploy"
        	echo -e "\t\tbash deploy.bash -clean user vm1 vm2 vm3"
      ;;
      "-genkey")
			gen_key
      ;;
      "-newsession")
			i=$((i+1))
			user=${args[$i]}
			i=$((i+1))
			host=${args[$i]}
			user_host="$user@$host"
			share_key $user_host
      ;;
      "-deploy")
			i=$((i+1))
			user=${args[$i]}
			i=$((i+1))
			host1=${args[$i]}
			i=$((i+1))
			host2=${args[$i]}
			i=$((i+1))
			host3=${args[$i]}

			# check if user is root, because if not, deploy is impossible (because of service creation)
			if [ $user != "root" ]
			then
				echo "ERROR: deploy needs root permissions"
				break
			fi

			# calculate user_hosts
			user_host1="$user@$host1"
			user_host2="$user@$host2"
			user_host3="$user@$host3"

			# install web required modules
			build_web

			# deploy in each host
			echo "deploying on $host1 ..."
			deploy_one_machine $user_host1 ""
			echo "deploying on $host2 ..."
			deploy_one_machine $user_host2 $host1
			echo "deploying on $host3 ..."
			deploy_one_machine $user_host3 $host1

			# wait for dht to deploy
			echo "sleep 5 seconds to allow dht to start properly ..."
			sleep 5

			echo "You can open the clients on: "
			echo -e "\t \e]8;;http://$host1/\e]8;;\a"
			echo -e "\t \e]8;;http://$host2/\e]8;;\a"
			echo -e "\t \e]8;;http://$host3/\e]8;;\a"
      ;;
      "-clean")
			i=$((i+1))
			user=${args[$i]}
			i=$((i+1))
			host1=${args[$i]}
			i=$((i+1))
			host2=${args[$i]}
			i=$((i+1))
			host3=${args[$i]}

			# check if user is root, because if not, deploy is impossible (because of service creation)
			if [ $user != "root" ]
			then
				echo "ERROR: deploy needs root permissions"
				break
			fi

			# calculate user_hosts
			user_host1="$user@$host1"
			user_host2="$user@$host2"
			user_host3="$user@$host3"

			# clean in each host
			clean_one_machine $user_host1
			clean_one_machine $user_host2
			clean_one_machine $user_host3
      ;;
      *)
        	echo "ERROR: unknown command: $selected_command, run deployer.bash -h for help"
        	break
      ;;
  	esac
done
