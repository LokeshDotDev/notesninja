require('dotenv').config();
const { sendPurchaseEmail, getEmailStats, getEmailQueue } = require('../lib/brevo');

async function testEmailFlow() {
  console.log('🧪 Testing Complete Email Flow...\n');

  try {
    // 1. Check current email stats
    console.log('1. 📊 Current Email Stats:');
    const stats = getEmailStats();
    console.log(`   Total: ${stats.total}`);
    console.log(`   Sent: ${stats.sent}`);
    console.log(`   Failed: ${stats.failed}`);
    console.log(`   Pending: ${stats.pending}\n`);

    // 2. Test email sending
    console.log('2. 📧 Testing Email Sending:');
    const testEmailData = {
      to: 'purohitlokesh46@gmail.com',
      subject: '🧪 Test Email - NotesNinja Email Flow',
      customerName: 'Lokesh',
      productName: 'Test Digital Product',
      price: 99,
      downloadLinks: [
        {
          fileName: 'test-file.pdf',
          fileUrl: 'https://notesninja.in/api/download?fileUrl=test&fileName=test-file.pdf',
          fileSize: 1024000,
          fileType: 'application/pdf',
          publicId: 'test_public_id'
        }
      ]
    };

    console.log('   Sending test email...');
    const result = await sendPurchaseEmail(testEmailData);
    
    if (result.success) {
      console.log('   ✅ Test email sent successfully!');
      console.log(`   📧 Message ID: ${result.messageId}`);
    } else {
      console.log('   ❌ Test email failed:', result.error);
    }

    // 3. Check updated stats
    console.log('\n3. 📊 Updated Email Stats:');
    const updatedStats = getEmailStats();
    console.log(`   Total: ${updatedStats.total}`);
    console.log(`   Sent: ${updatedStats.sent}`);
    console.log(`   Failed: ${updatedStats.failed}`);
    console.log(`   Pending: ${updatedStats.pending}`);

    // 4. Show recent email queue
    console.log('\n4. 📋 Recent Email Queue:');
    const queue = getEmailQueue();
    const recentEmails = queue.slice(-3); // Show last 3 emails
    
    recentEmails.forEach((email, index) => {
      console.log(`   ${index + 1}. ${email.to} - ${email.status} (${email.attempts} attempts)`);
      if (email.errorMessage) {
        console.log(`      Error: ${email.errorMessage}`);
      }
    });

    console.log('\n✅ Email flow test completed!');
    console.log('💡 To monitor emails in real-time, visit: /api/email-monitoring');
    console.log('💡 To clear old logs, visit: /api/email-monitoring?action=clear&clearHours=24');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testEmailFlow();
