// api/submit-memorial-garden.js
// Enhanced version with all fields from Bay View databases

export default async function handler(req, res) {
  // Enable CORS for your GitHub Pages domain
  const allowedOrigins = [
    'https://bvaadmin.github.io',
    'https://vercel.com',
    'http://localhost:3000', // for local testing
    'http://127.0.0.1:5500'  // for VS Code Live Server
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Default to GitHub Pages for production
    res.setHeader('Access-Control-Allow-Origin', 'https://bvaadmin.github.io');
  }
  
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

  // Your Notion API key (set this in Vercel environment variables)
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
          // Title property (Submission ID or Application ID)
          'Submission ID': {
            title: [
              {
                text: {
                  content: properties['Submission ID'] || properties['Application ID'] || ''
                }
              }
            ]
          },
          
          // Date properties
          'Submission Date': properties['date:Submission Date:start'] ? {
            date: {
              start: properties['date:Submission Date:start'],
              end: properties['date:Submission Date:end'] || null,
              time_zone: properties['date:Submission Date:timezone'] || null
            }
          } : undefined,
          
          'Service Date': properties['date:Service Date:start'] ? {
            date: {
              start: properties['date:Service Date:start'],
              end: properties['date:Service Date:end'] || null,
              time_zone: properties['date:Service Date:timezone'] || null
            }
          } : undefined,
          
          // Additional date fields from memorial entries
          'Date of Birth': properties['date:Date of Birth:start'] ? {
            date: {
              start: properties['date:Date of Birth:start']
            }
          } : undefined,
          
          'Date of Death': properties['date:Date of Death:start'] ? {
            date: {
              start: properties['date:Date of Death:start']
            }
          } : undefined,
          
          // Select properties
          'Status': properties['Status'] || properties['Application Status'] ? {
            select: {
              name: properties['Status'] || properties['Application Status']
            }
          } : undefined,
          
          'Application Type': properties['Application Type'] || properties['Application Purpose'] ? {
            select: {
              name: properties['Application Type'] || properties['Application Purpose']
            }
          } : undefined,
          
          'Bay View Member': properties['Bay View Member'] || properties['Bay View Member Status'] ? {
            select: {
              name: properties['Bay View Member'] || properties['Bay View Member Status']
            }
          } : undefined,
          
          'Celebrant Requested': properties['Celebrant Requested'] || properties['Celebrant Request'] ? {
            select: {
              name: properties['Celebrant Requested'] || properties['Celebrant Request']
            }
          } : undefined,
          
          // Additional select field
          'Preferred Time': properties['Preferred Time'] ? {
            select: {
              name: properties['Preferred Time']
            }
          } : undefined,
          
          // Text properties
          'Contact Name': properties['Contact Name'] || properties['Applicant Name'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Contact Name'] || properties['Applicant Name'] || ''
                }
              }
            ]
          } : undefined,
          
          'Contact Phone': properties['Contact Phone'] ? {
            phone_number: properties['Contact Phone']
          } : undefined,
          
          'Contact Email': properties['Contact Email'] ? {
            email: properties['Contact Email']
          } : undefined,
          
          'Contact Address': properties['Contact Address'] || properties['Permanent Home Address'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Contact Address'] || properties['Permanent Home Address'] || ''
                }
              }
            ]
          } : undefined,
          
          'Bay View Address': properties['Bay View Address'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Bay View Address']
                }
              }
            ]
          } : undefined,
          
          // Deceased information fields
          'Deceased Name': properties['Deceased Name'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Deceased Name']
                }
              }
            ]
          } : undefined,
          
          'First Name of Deceased': properties['First Name of Deceased'] ? {
            rich_text: [
              {
                text: {
                  content: properties['First Name of Deceased']
                }
              }
            ]
          } : undefined,
          
          'Last Name of Deceased': properties['Last Name of Deceased'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Last Name of Deceased']
                }
              }
            ]
          } : undefined,
          
          'Middle Name': properties['Middle Name'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Middle Name']
                }
              }
            ]
          } : undefined,
          
          'Maiden Name': properties['Maiden Name'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Maiden Name']
                }
              }
            ]
          } : undefined,
          
          'Place of Birth': properties['Place of Birth'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Place of Birth']
                }
              }
            ]
          } : undefined,
          
          'Mother\'s Name': properties['Mother\'s Name'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Mother\'s Name']
                }
              }
            ]
          } : undefined,
          
          'Father\'s Name': properties['Father\'s Name'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Father\'s Name']
                }
              }
            ]
          } : undefined,
          
          // Member relationship fields
          'Member Name': properties['Member Name'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Member Name']
                }
              }
            ]
          } : undefined,
          
          'Member Relationship': properties['Member Relationship'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Member Relationship']
                }
              }
            ]
          } : undefined,
          
          // History and notes
          'Bay View History': properties['Bay View History'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Bay View History']
                }
              }
            ]
          } : undefined,
          
          'Personal History JSON': properties['Personal History JSON'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Personal History JSON']
                }
              }
            ]
          } : undefined,
          
          'Prepayment Names': properties['Prepayment Names'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Prepayment Names']
                }
              }
            ]
          } : undefined,
          
          // Number properties
          'Fee Amount': properties['Fee Amount'] || properties['Payment Amount'] ? {
            number: Number(properties['Fee Amount'] || properties['Payment Amount'])
          } : undefined,
          
          'Number of Cremains': properties['Number of Cremains'] ? {
            number: Number(properties['Number of Cremains'])
          } : undefined,
          
          // Checkbox property
          'Policy Agreement': {
            checkbox: properties['Policy Agreement'] === '__YES__' || properties['Policy Agreement'] === true
          },
          
          // Additional fields that might be needed based on the database schema
          // These fields exist in the database but weren't in original API
          'Application ID': properties['Application ID'] && !properties['Submission ID'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Application ID']
                }
              }
            ]
          } : undefined,
          
          'Member ID': properties['Member ID'] ? {
            rich_text: [
              {
                text: {
                  content: properties['Member ID']
                }
              }
            ]
          } : undefined
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
    
    // Log successful submission for workflow tracking
    if (process.env.WORKFLOW_LOG_DATABASE_ID) {
      try {
        await logWorkflowStep(
          properties['Submission ID'] || properties['Application ID'],
          'Application Submitted',
          'Completed',
          'API',
          'Form submitted successfully'
        );
      } catch (logError) {
        console.error('Failed to log workflow step:', logError);
        // Don't fail the main request if logging fails
      }
    }
    
    return res.status(200).json({
      success: true,
      submissionId: properties['Submission ID'] || properties['Application ID'],
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

// Helper function to log workflow steps
async function logWorkflowStep(bookingId, stepName, status, processedBy, notes) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const WORKFLOW_LOG_DATABASE_ID = process.env.WORKFLOW_LOG_DATABASE_ID || '99fd3b80-8af4-415a-8dd6-84f99a700dd6';
  
  const logId = `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  await fetch(`https://api.notion.com/v1/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      parent: { database_id: WORKFLOW_LOG_DATABASE_ID },
      properties: {
        'Log ID': {
          title: [
            {
              text: {
                content: logId
              }
            }
          ]
        },
        'Booking ID': {
          rich_text: [
            {
              text: {
                content: bookingId
              }
            }
          ]
        },
        'Step Name': {
          select: {
            name: stepName
          }
        },
        'Status': {
          select: {
            name: status
          }
        },
        'Processed By': {
          rich_text: [
            {
              text: {
                content: processedBy
              }
            }
          ]
        },
        'Notes': {
          rich_text: [
            {
              text: {
                content: notes
              }
            }
          ]
        },
        'Processed At': {
          date: {
            start: new Date().toISOString()
          }
        }
      }
    })
  });
}
