#!/bin/bash

PORT="1883"
HOST="broker.hivemq.com"
TOPIC="/mqtt/engcomp/lm35/$SECRET_HASH/diffusion"

data="{\"analog\":\"1024\",\"temp\":\"25.2\",\"milliVolts\":\"110.2\"}"

echo "Publicando" $data "no tópico" $TOPIC

mosquitto_pub \
 -h ${HOST} \
 -p ${PORT} \
 -t ${TOPIC} \
 -m "$data"