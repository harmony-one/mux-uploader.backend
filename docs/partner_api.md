## Partner API

### Get Reverse Record for an Address

Endpoint:
https://mdo-dcobackend-01.t.hmny.io/reverse/:address

Example:
curl -XGET https://mdo-dcobackend-01.t.hmny.io/reverse/0xCBB2CDFa7551650B767f12527D54B221176E26a8

Response:

```json
{
  "data": {
    "networkId": 1666600000,
    "blockchain": "harmony",
    "resolver": "0x46E37034Ffc87a969d1a581748Acf6a94Bc7415D",
    "registry": "0x547942748Cc8840FEc23daFdD01E6457379B446D",
    "reverse": "0xCBB2CDFa7551650B767f12527D54B221176E26a8",
    "domain": "00000000011.country",
    "owner": "0xCBB2CDFa7551650B767f12527D54B221176E26a8",
    "createdAt": "2023-03-10T01:41:51.215Z"
  }
}
```

### Get Records for a Domain

Endpoint:
https://mdo-dcobackend-01.t.hmny.io/records/?domains=[domain01.country,...]

Example:
curl -XGET https://mdo-dcobackend-01.t.hmny.io/records/?domains=s.country,abhinav.country

Response

```json
{
  "data": [
    {
      "domain": "s.country",
      "records": {}
    },
    {
      "domain": "abhinav.country",
      "records": {}
    }
  ]
}
```

### Get Supported TLDs

Endpoint:
https://mdo-dcobackend-01.t.hmny.io/tlds

Example:
curl -XGET https://mdo-dcobackend-01.t.hmny.io/tlds

Response:

```json
{ "data": ["country"] }
```
