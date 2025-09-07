export default async function radarWebhook(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { event, user } = req.body;

    // Log the webhook data (for demo purposes)
    console.log("Radar webhook received:", {
      userInfo: {
        userId: user.userId,
        deviceId: user.deviceId,
        locationAuthorization: user.locationAuthorization,
      },
    });

    // Process event
    if (event.type === "user.entered_geofence") {
      await handleGeofenceEntry(event, user);
    }

    // Return success response to Radar
    res.status(200).json({
      success: true,
      processed: event._id,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGeofenceEntry(event, user) {
  const { geofence } = event;

  console.log(`User ${user.userId} entered geofence:`, {
    storeId: geofence.externalId,
    description: geofence.description,
    tag: geofence.tag,
    metadata: geofence.metadata,
    timestamp: event.actualCreatedAt,
  });

  // Demo promotion logic
  const promotion = await getPromotionForStore(
    geofence.externalId,
    user.userId
  );

  if (promotion.eligible) {
    console.log(`Sending promotion: ${promotion.title} to user ${user.userId}`);

    // In real implementation, send push notification here
    // await sendPushNotification(user.userId, promotion);

    // Log promotion delivery
    await logPromotionEvent({
      userId: user.userId,
      storeId: geofence.externalId,
      promotionId: promotion.id,
      deliveryMethod: "push",
      timestamp: new Date().toISOString(),
    });
  }
}

async function getPromotionForStore(externalId, userId) {
  // Demo promotion logic - in real app, query your database
  const storePromotions = {
    store_001: {
      id: "welcome_10",
      title: "Welcome! 10% Off",
      description: "Get 10% off your entire purchase",
      eligible: true,
    },
    store_002: {
      id: "mall_special",
      title: "Mall Special - 15% Off",
      description: "Exclusive mall location discount",
      eligible: true,
    },
  };

  return storePromotions[externalId] || { eligible: false };
}

async function logPromotionEvent(eventData) {
  // Demo logging - in real app, save to database
  console.log("Promotion event logged:", eventData);
}

// {
//   "events": [
//     {
//       "_id": "56db1f4613012711002229f6",
//       "type": "user.entered_geofence",
//       "createdAt": "2018-06-12T13:44:10.535Z",
//       "live": true,
//       "user": {
//         "userId": "1",
//         "deviceId": "C305F2DB-56DC-404F-B6C1-BC52F0B680D8",
//         "metadata": {
//           "customId": "abc",
//           "customFlag": false
//         },
//         "locationAuthorization": "GRANTED_FOREGROUND",
//         "locationAccuracyAuthorization": "FULL"
//       },
//       "geofence": {
//         "tag": "store",
//         "externalId": "123",
//         "description": "Store #123",
//         "metadata": {
//           "parking": false
//         }
//       },
//       "location": {
//         "type": "Point",
//         "coordinates": [
//           -73.977797,
//           40.783826
//         ]
//       },
//       "locationAccuracy": 5,
//       "confidence": 3,
//       "foreground": true,
//       "actualCreatedAt": "2018-06-12T13:44:10.535Z"
//     },
//     {
//       "_id": "56db1f4613012711002229f7",
//       "type": "user.entered_place",
//       "createdAt": "2018-06-12T13:44:10.535Z",
//       "live": true,
//       "user": {
//         "_id": "56db1f4613012711002229f4",
//         "userId": "1",
//         "deviceId": "C305F2DB-56DC-404F-B6C1-BC52F0B680D8",
//         "metadata": {
//           "customId": "abc",
//           "customFlag": false
//         },
//         "locationAuthorization": "GRANTED_FOREGROUND",
//         "locationAccuracyAuthorization": "FULL"
//       },
//       "place": {
//         "name": "Starbucks",
//         "chain": {
//           "name": "Starbucks",
//           "slug": "starbucks",
//           "externalId": "123",
//           "metadata": {
//             "customFlag": true
//           }
//         },
//         "categories": [
//           "food-beverage",
//           "coffee-shop"
//         ],
//         "location": {
//           "type": "Point",
//           "coordinates": [
//             -73.977797,
//             40.783826
//           ]
//         }
//       },
//       "location": {
//         "type": "Point",
//         "coordinates": [
//           -73.977797,
//           40.783826
//         ]
//       },
//       "locationAccuracy": 5,
//       "confidence": 2,
//       "foreground": true,
//       "actualCreatedAt": "2018-06-12T13:44:10.535Z"
//     }
//   ],
//   "user": {
//     "_id": "56db1f4613012711002229f4",
//     "live": true,
//     "userId": "1",
//     "deviceId": "C305F2DB-56DC-404F-B6C1-BC52F0B680D8",
//     "metadata": {
//       "customId": "abc",
//       "customFlag": false
//     },
//     "updatedAt": "2018-06-12T13:44:10.535Z",
//     "createdAt": "2018-06-10T11:23:58.741Z",
//     "location": {
//       "type": "Point",
//       "coordinates": [
//         -73.977797,
//         40.783826
//       ]
//     },
//     "locationAccuracy": 5,
//     "locationAuthorization": "GRANTED_FOREGROUND",
//     "locationAccuracyAuthorization": "FULL",
//     "stopped": true,
//     "foreground": false,
//     "deviceType": "iOS",
//     "ip": "173.14.0.1",
//     "geofences": [
//       {
//         "tag": "store",
//         "externalId": "123",
//         "description": "Store #123",
//         "metadata": {
//           "parking": false
//         }
//       }
//     ],
//     "place": {
//       "name": "Starbucks",
//       "chain": {
//         "name": "Starbucks",
//         "slug": "starbucks"
//       },
//       "categories": [
//         "food-beverage",
//         "coffee-shop"
//       ],
//       "location": {
//         "type": "Point",
//         "coordinates": [
//           -73.977797,
//           40.783826
//         ]
//       }
//     },
//     "country": {
//       "code": "US",
//       "name": "United States",
//       "flag": "🇺🇸"
//     },
//     "state": {
//       "code": "MD",
//       "name": "Maryland",
//       "passed": false,
//       "allowed": true,
//       "distanceToBorder": 1092.3,
//       "inBufferZone": false,
//       "inExclusionZone": false
//     },
//     "dma": {
//       "code": "26",
//       "name": "Baltimore"
//     },
//     "postalCode": {
//       "code": "21014",
//       "name": "21014"
//     },
//     "segments": [
//       {
//         "description": "Starbucks Visitors",
//         "externalId": "starbucks-visitors"
//       }
//     ],
//     "topChains": [
//       {
//         "name": "Starbucks",
//         "slug": "starbucks",
//         "externalId": "123"
//       },
//       {
//         "name": "Walmart",
//         "slug": "walmart",
//         "externalId": "456"
//       }
//     ],
//     "fraud": {
//       "verified": true,
//       "passed": false,
//       "bypassed": false,
//       "blocked": false,
//       "mocked": true,
//       "jumped": false,
//       "compromised": false,
//       "inaccurate": false,
//       "proxy": false,
//       "sharing": false,
//       "lastMockedAt": "2023-07-27T17:18:28.536Z",
//       "lastJumpedAt": "2023-07-27T17:18:28.536Z",
//       "lastCompromisedAt": null,
//       "lastInaccurateAt": null,
//       "lastProxyAt": null,
//       "lastSharingAt": null
//     }
//   }
// }
