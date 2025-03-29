# Temporary Links for Jua Mining Game

This document explains how to use the temporary link feature that allows you to share your Jua Mining Game with time-limited access.

## How It Works

1. Temporary links expire after 2 hours
2. Each link contains a unique token
3. When someone visits a temporary link, the system checks if the token is valid and not expired
4. If valid, they're redirected to the game; otherwise, they see an error message

## How to Generate Temporary Links

1. **Visit the admin page**: Go to `/admin/generate-link` on your Vercel deployment
   - Example: `https://your-vercel-app.vercel.app/admin/generate-link`

2. **Generate a new link**: Click the "Generate Temporary Link" button

3. **Share the link**: Copy the generated link and share it with others
   - The link will look like: `https://your-vercel-app.vercel.app/access?token=abc123`

4. **Link expiration**: The link will automatically expire after 2 hours

## Security Considerations

- This is a simple implementation using server memory
- For a production app, you would:
  - Store tokens in a database (like MongoDB or PostgreSQL)
  - Add password protection to the admin page
  - Implement rate limiting to prevent abuse
  - Allow customizing expiration times

## Implementation Details

This feature uses Next.js API routes and server-side rendering:

1. `/api/temp-link` - Generates temporary tokens
2. `/api/validate-token` - Validates tokens and checks expiration
3. `/access` - Access page that validates and redirects
4. `/admin/generate-link` - Admin UI to generate links

## Troubleshooting

If you encounter issues:

1. **Link expired**: Generate a new link
2. **Error validating**: Check your server logs
3. **Admin page not working**: Ensure you've deployed with the latest code 