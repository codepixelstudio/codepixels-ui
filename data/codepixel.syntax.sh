ext=`curl ipecho.net/plain ; echo`
adds=`ifconfig | grep "inet " | awk '{print $2}'`
eth=`echo $adds | awk '{print $3}'`
int=`echo $adds | awk '{print $2}'`

echo $ext
echo $int
echo $eth
