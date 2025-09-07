export default async function radarWebhook(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { events, user } = req.body;

    // Log the webhook data (for demo purposes)
    console.log("Radar webhook received:", {
      userInfo: {
        userId: user.userId,
        deviceId: user.deviceId,
        locationAuthorization: user.locationAuthorization,
      },
      eventCount: events.length,
    });

    // Process each event
    for (const event of events) {
      if (event.type === "user.entered_geofence") {
        await handleGeofenceEntry(event, user);
      }
    }

    // Return success response to Radar
    res.status(200).json({
      success: true,
      processed: events.length,
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
