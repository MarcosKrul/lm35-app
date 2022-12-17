#!/bin/bash

PORT="1883"
HOST="broker.hivemq.com"
TOPIC="/mqtt/engcomp/lm35/$SECRECT_HASH/diffusion"

mosquitto_sub \
 -h ${HOST} \
 -p ${PORT} \
 -t ${TOPIC}
