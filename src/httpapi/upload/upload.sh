#!/bin/bash

curl -i -X POST -F "video=@big_buck_bunny_720p_1mb.mp4" \
  -F "name=my video name" \
  -F "description=my video description" \
  -F "url=my-video" \
  http://localhost:8080/upload
