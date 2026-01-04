/**
 * Script to initialize admin user
 * Run: node scripts/init-admin.js
 */

const adminData = {
  name: 'Aftab Bashir',
  email: process.env.ADMIN_EMAIL || 'aftab@gmail.com',
  password: process.env.ADMIN_PASSWORD || '12345678',
}

async function initAdmin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    })

    const result = await response.json()

    if (result.success) {
      console.log('✅ Admin user created successfully!')
      console.log('📧 Email:', adminData.email)
      console.log('🔑 Password:', adminData.password)
    } else {
      console.error('❌ Error:', result.message || result.error)
    }
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message)
    console.log('\n💡 Make sure your Next.js server is running on http://localhost:3000')
  }
}

initAdmin()

