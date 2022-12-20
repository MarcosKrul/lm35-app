#!/bin/bash

PORT="1883"
HOST="broker.hivemq.com"
TOPIC="/mqtt/engcomp/lm35/$SECRET_HASH/control/frequency"

echo "Publicando" $1 "no tópico" $TOPIC

mosquitto_pub \
 -h ${HOST} \
 -p ${PORT} \
 -t ${TOPIC} \
 -m "$1"