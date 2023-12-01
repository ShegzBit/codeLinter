#!/usr/bin/env bash

# install pycodestyle
which pycodestyle > /dev/null
if [ $? -ne 0 ]
then
	pip install pycodestyle || pip3 install pycodestyle
	if [ $? -ne 0 ]
	then
		echo 'Failed to install pycodestyle'
	fi
fi
# install semistandard
which semistandard > /dev/null
if [ $? -ne 0 ]
then
	npm install semistandard -g
	if [ $? -ne 0 ]
	then
		echo 'Failed to install semistandard'
	fi
fi
# clone and install betty
which betty > /dev/null
if [ $? -ne 0 ]
then
	git clone https://github.com/alx-tools/Betty.git && cd Betty && sudo ./install.sh
	if [ $? -ne 0 ]
	then
		echo 'Failed to install betty'
	fi
fi

which shellcheck > /dev/null
if [ $? -ne 0 ]
then
	sudo apt-get install shellcheck -y
	if [ $? -ne 0 ]
	then
		echo 'Failed to install Shellcheck'
	fi
fi

cwd=$(pwd)
filepath="$cwd/codeStyle.js"
codeAlias="codestyle() {\n\t'$filepath' \"\$@\" \n}"
echo -e "$codeAlias" >> ~/.bashrc
