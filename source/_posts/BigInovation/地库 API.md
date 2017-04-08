---
title: 地库 API
date: 2017-04-08
categories: BigInovation
tags: BigInovation
---

## Global rules

<!-- more -->### Request

1. Requests are MOSTLY without body, just `METHOD /example`
2. Some request may need sending a JSON. The JSON MUST be put in HTTP body

### Response

1. All responses MUST be transported using JSON `object` as body
2. All responses MUST contain status as below

    > `"success"` MUST exists, type: `bool`
    >
    > if `"success" == false`, you CAN get error message via `"error_msg": "str" and "error_id": int`


3. The response content MUST be stored in the `result` element of `object` type


Example:

```
{
    "success": true,
    "result" : {
        ....
    }
}
```

```
{
    "success": false,
    "error_msg": "error description",
    "errro_id": 23333
}
```

## Map APIs

### Create a new map ID

Request:

`POST /map`

Response:

```json
{
   "id": 1212
}
```

### Update map info

Request:

`PATCH /map/<id>`

```json
{
	"desc": "str of description",
	"lon": 2.333333,
	"lat": -23.33333
}
```

Response: (empty JSON object)

```json
{
}
```

### Upload map GeoJSON

Request:

`PUT /map/<id>/geojson`

```
<GeoJSON content>
```

Response: (empty JSON object)

<!-- more -->### Get map GeoJSON

Request:

`GET /map/<id>/geojson`

Response:

```
<GeoJSON content>
```

### Get nearest map ID

Request:

`GET /map/near/<lat>/<lon>`

Response:

```json
{
	"id": 233,
	"distance": 1212.2
}
```

> distance is the distance of your position and map by meters

### Delete map

Request:

`DELETE /map/<id>`

Response: (empty JSON object)
