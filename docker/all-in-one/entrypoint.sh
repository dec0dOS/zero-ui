#!/bin/sh

grepzt() {
  (find /proc -name exe | xargs -I{} readlink {}) 2>/dev/null | grep -q zerotier-one
  return $?
}

echo "starting zerotier"
setsid /usr/sbin/zerotier-one &

while ! grepzt
do
  echo "zerotier hasn't started, waiting a second"
  sleep 1
done

echo "joining networks"

for i in "$@"
do
  echo "joining $i"

  while ! zerotier-cli join "$i"
  do 
    echo "joining $i failed; trying again in 1s"
    sleep 1
  done
done

echo "starting node"
node ./bin/www
echo "at end"
