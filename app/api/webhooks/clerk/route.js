import { getServiceClient } from '@/lib/supabase';

export async function POST(req) {
  var supabase = getServiceClient();
  if (!supabase) {
    return new Response('Supabase not configured', { status: 500 });
  }

  try {
    const payload = await req.json();
    const { type, data } = payload;

    if (type === 'user.created' || type === 'user.updated') {
      const { id: clerkId, email_addresses, first_name, last_name, image_url } = data;
      const email = email_addresses?.[0]?.email_address || '';
      const name = [first_name, last_name].filter(Boolean).join(' ') || 'User';

      // Upsert into existing users table (matches existing schema)
      const { error } = await supabase
        .from('users')
        .upsert(
          {
            clerk_id: clerkId,
            email,
            name,
            avatar_url: image_url || '',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'clerk_id' }
        );

      if (error) {
        console.error('Clerk webhook upsert error:', error);
        return new Response('Database error', { status: 500 });
      }
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Clerk webhook error:', err);
    return new Response('Webhook error', { status: 500 });
  }
}
