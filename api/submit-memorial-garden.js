export default async function handler(req, res) {
  // Enable CORS for your GitHub Pages domain
  res.setHeader('Access-Control-Allow-Origin', 'https://bvaadmin.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Your Notion API key (from environment variables)
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const DATABASE_ID = 'e438c3bd041a4977baacde59ea4cc1e7';

  if (!NOTION_API_KEY) {
    return res.status(500).json({ error: 'Notion API key not configured' });
  }

  try {
    const { properties } = req.body;

    // Create the Notion page
    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          'Submission ID': {
            title: [{
              text: { content: properties['Submission ID'] || '' }
            }]
          },
          'Submission Date': properties['date:Submission Date:start'] ? {
            date: { start: properties['date:Submission Date:start'] }
          } : undefined,
          'Service Date': properties['date:Service Date:start'] ? {
            date: { start: properties['date:Service Date:start'] }
          } : undefined,
          'Status': properties['Status'] ? {
            select: { name: properties['Status'] }
          } : undefined,
          'Application Type': properties['Application Type'] ? {
            select: { name: properties['Application Type'] }
          } : undefined,
          'Bay View Member': properties['Bay View Member'] ? {
            select: { name: properties['Bay View Member'] }
          } : undefined,
          'Celebrant Requested': properties['Celebrant Requested'] ? {
            select: { name: properties['Celebrant Requested'] }
          } : undefined,
          'Contact Name': properties['Contact Name'] ? {
            rich_text: [{
              text: { content: properties['Contact Name'] }
            }]
          } : undefined,
          'Contact Phone': properties['Contact Phone'] ? {
            phone_number: properties['Contact Phone']
          } : undefined,
          'Contact Email': properties['Contact Email'] ? {
            email: properties['Contact Email']
          } : undefined,
          'Contact Address': properties['Contact Address'] ? {
            rich_text: [{
              text: { content: properties['Contact Address'] }
            }]
          } : undefined,
          'Deceased Name': properties['Deceased Name'] ? {
            rich_text: [{
              text: { content: properties['Deceased Name'] }
            }]
          } : undefined,
          'Member Name': properties['Member Name'] ? {
            rich_text: [{
              text: { content: properties['Member Name'] }
            }]
          } : undefined,
          'Member Relationship': properties['Member Relationship'] ? {
            rich_text: [{
              text: { content: properties['Member Relationship'] }
            }]
          } : undefined,
          'Bay View History': properties['Bay View History'] ? {
            rich_text: [{
              text: { content: properties['Bay View History'] }
            }]
          } : undefined,
          'Personal History JSON': properties['Personal History JSON'] ? {
            rich_text: [{
              text: { content: properties['Personal History JSON'] }
            }]
          } : undefined,
          'Prepayment Names': properties['Prepayment Names'] ? {
            rich_text: [{
              text: { content: properties['Prepayment Names'] }
            }]
          } : undefined,
          'Fee Amount': properties['Fee Amount'] ? {
            number: properties['Fee Amount']
          } : undefined,
          'Policy Agreement': {
            checkbox: properties['Policy Agreement'] === '__YES__'
          }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to create Notion entry',
        details: errorData 
      });
    }

    const notionResponse = await response.json();
    
    return res.status(200).json({
      success: true,
      submissionId: properties['Submission ID'],
      notionId: notionResponse.id,
      url: notionResponse.url
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
