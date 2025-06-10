import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;

    // Get the primary email
    const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
    const email = primaryEmail?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    try {
      // Check if profile exists
      const existingProfile = await db.profile.findFirst({
        where: { userId: id }
      });

      if (!existingProfile) {
        // Create profile
        const profile = await db.profile.create({
          data: {
            userId: id,
            email,
            name: name || null,
            imageUrl: image_url || null,
          }
        });

        // Create member record
        await db.member.create({
          data: {
            profileId: profile.id,
            provider: 'clerk',
            providerAccountId: id,
            // Make the first user an admin
            type: (await db.profile.count()) === 1 ? 'ADMIN' : 'GUEST'
          }
        });
      } else {
        // Update existing profile
        await db.profile.update({
          where: { id: existingProfile.id },
          data: {
            email,
            name: name || null,
            imageUrl: image_url || null,
          }
        });
      }
    } catch (error) {
      console.error('Error handling user webhook:', error);
      return new Response('Error processing webhook', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
} 