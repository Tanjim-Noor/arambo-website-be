import { Client } from '@notionhq/client';
import { NOTION_TOKEN, NOTION_DATABASE_ID } from '../config';
import { Property, PropertyFilters, PropertyResponse } from '../validators/property.validator';

// Initialize Notion client
const notion = new Client({
  auth: NOTION_TOKEN,
});

// Map property types to Notion property values
const mapPropertyTypeToNotion = (type: string): string => {
  const typeMap: Record<string, string> = {
    'apartment': 'Apartment',
    'house': 'House',
    'villa': 'Villa',
    'townhouse': 'Townhouse',
    'studio': 'Studio',
    'duplex': 'Duplex',
    'penthouse': 'Penthouse',
    'commercial': 'Commercial',
    'land': 'Land',
    'other': 'Other'
  };
  return typeMap[type] || 'Other';
};

// Map category to Notion property values
const mapCategoryToNotion = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'sale': 'Sale',
    'rent': 'Rent',
    'lease': 'Lease',
    'buy': 'Buy'
  };
  return categoryMap[category] || 'Sale';
};

// Convert Notion page to Property object
const convertNotionPageToProperty = (page: any): PropertyResponse => {
  const properties = page.properties;
  
  return {
    id: page.id,
    name: properties.Name?.title?.[0]?.plain_text || '',
    email: properties.Email?.email || '',
    phone: properties.Phone?.phone_number || '',
    propertyName: properties.PropertyName?.rich_text?.[0]?.plain_text || '',
    propertyType: properties.PropertyType?.select?.name?.toLowerCase() || 'other',
    size: properties.Size?.number || 0,
    location: properties.Location?.rich_text?.[0]?.plain_text || '',
    bedrooms: properties.Bedrooms?.number || 0,
    bathroom: properties.Bathroom?.number || 0,
    baranda: properties.Baranda?.checkbox || false,
    category: properties.Category?.select?.name?.toLowerCase() || 'sale',
    notes: properties.Notes?.rich_text?.[0]?.plain_text || '',
    firstOwner: properties.FirstOwner?.checkbox || false,
    paperworkUpdated: properties.PaperworkUpdated?.checkbox || false,
    onLoan: properties.OnLoan?.checkbox || false,
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
  };
};

// Create a new property listing in Notion
export const createListing = async (data: Property): Promise<PropertyResponse> => {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: NOTION_DATABASE_ID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: data.name,
              },
            },
          ],
        },
        Email: {
          email: data.email,
        },
        Phone: {
          phone_number: data.phone,
        },
        PropertyName: {
          rich_text: [
            {
              text: {
                content: data.propertyName,
              },
            },
          ],
        },
        PropertyType: {
          select: {
            name: mapPropertyTypeToNotion(data.propertyType),
          },
        },
        Size: {
          number: data.size,
        },
        Location: {
          rich_text: [
            {
              text: {
                content: data.location,
              },
            },
          ],
        },
        Bedrooms: {
          number: data.bedrooms,
        },
        Bathroom: {
          number: data.bathroom,
        },
        Baranda: {
          checkbox: data.baranda,
        },
        Category: {
          select: {
            name: mapCategoryToNotion(data.category),
          },
        },
        Notes: {
          rich_text: data.notes ? [
            {
              text: {
                content: data.notes,
              },
            },
          ] : [],
        },
        FirstOwner: {
          checkbox: data.firstOwner,
        },
        PaperworkUpdated: {
          checkbox: data.paperworkUpdated,
        },
        OnLoan: {
          checkbox: data.onLoan,
        },
      },
    });

    return convertNotionPageToProperty(response);
  } catch (error) {
    console.error('Error creating listing in Notion:', error);
    throw new Error('Failed to create property listing');
  }
};

// Query property listings from Notion with filters
export const queryListings = async (filters: PropertyFilters): Promise<{
  properties: PropertyResponse[];
  total: number;
}> => {
  try {
    // Build Notion filter conditions
    const notionFilters: any[] = [];

    if (filters.category) {
      notionFilters.push({
        property: 'Category',
        select: {
          equals: mapCategoryToNotion(filters.category),
        },
      });
    }

    if (filters.propertyType) {
      notionFilters.push({
        property: 'PropertyType',
        select: {
          equals: mapPropertyTypeToNotion(filters.propertyType),
        },
      });
    }

    if (filters.bedrooms !== undefined) {
      notionFilters.push({
        property: 'Bedrooms',
        number: {
          equals: filters.bedrooms,
        },
      });
    }

    if (filters.minSize !== undefined) {
      notionFilters.push({
        property: 'Size',
        number: {
          greater_than_or_equal_to: filters.minSize,
        },
      });
    }

    if (filters.maxSize !== undefined) {
      notionFilters.push({
        property: 'Size',
        number: {
          less_than_or_equal_to: filters.maxSize,
        },
      });
    }

    if (filters.location) {
      notionFilters.push({
        property: 'Location',
        rich_text: {
          contains: filters.location,
        },
      });
    }

    if (filters.firstOwner !== undefined) {
      notionFilters.push({
        property: 'FirstOwner',
        checkbox: {
          equals: filters.firstOwner,
        },
      });
    }

    if (filters.onLoan !== undefined) {
      notionFilters.push({
        property: 'OnLoan',
        checkbox: {
          equals: filters.onLoan,
        },
      });
    }

    // Build query object
    const queryOptions: any = {
      database_id: NOTION_DATABASE_ID,
      page_size: 100, // Max allowed by Notion
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending',
        },
      ],
    };

    // Add filters if any exist
    if (notionFilters.length > 0) {
      queryOptions.filter = notionFilters.length === 1 
        ? notionFilters[0]
        : {
            and: notionFilters,
          };
    }
    console.log('Notion query options:', JSON.stringify(queryOptions, null, 2));
    const response = await notion.databases.query(queryOptions);

    // Convert pages to property objects
    const properties = response.results.map(convertNotionPageToProperty);

    return {
      properties,
      total: properties.length,
    };
  } catch (error) {
    console.error('Error querying listings from Notion:', error);
    throw new Error('Failed to fetch property listings');
  }
};

// Get a single property by ID
export const getListingById = async (id: string): Promise<PropertyResponse | null> => {
  try {
    const response = await notion.pages.retrieve({ page_id: id });
    return convertNotionPageToProperty(response);
  } catch (error) {
    console.error('Error fetching listing by ID:', error);
    return null;
  }
};

// Update a property listing
export const updateListing = async (id: string, data: Partial<Property>): Promise<PropertyResponse> => {
  try {
    const properties: any = {};

    // Only update provided fields
    if (data.name !== undefined) {
      properties.Name = {
        title: [{ text: { content: data.name } }],
      };
    }

    if (data.email !== undefined) {
      properties.Email = { email: data.email };
    }

    if (data.phone !== undefined) {
      properties.Phone = { phone_number: data.phone };
    }

    if (data.propertyName !== undefined) {
      properties.PropertyName = {
        rich_text: [{ text: { content: data.propertyName } }],
      };
    }

    if (data.propertyType !== undefined) {
      properties.PropertyType = {
        select: { name: mapPropertyTypeToNotion(data.propertyType) },
      };
    }

    if (data.size !== undefined) {
      properties.Size = { number: data.size };
    }

    if (data.location !== undefined) {
      properties.Location = {
        rich_text: [{ text: { content: data.location } }],
      };
    }

    if (data.bedrooms !== undefined) {
      properties.Bedrooms = { number: data.bedrooms };
    }

    if (data.bathroom !== undefined) {
      properties.Bathroom = { number: data.bathroom };
    }

    if (data.baranda !== undefined) {
      properties.Baranda = { checkbox: data.baranda };
    }

    if (data.category !== undefined) {
      properties.Category = {
        select: { name: mapCategoryToNotion(data.category) },
      };
    }

    if (data.notes !== undefined) {
      properties.Notes = {
        rich_text: data.notes ? [{ text: { content: data.notes } }] : [],
      };
    }

    if (data.firstOwner !== undefined) {
      properties.FirstOwner = { checkbox: data.firstOwner };
    }

    if (data.paperworkUpdated !== undefined) {
      properties.PaperworkUpdated = { checkbox: data.paperworkUpdated };
    }

    if (data.onLoan !== undefined) {
      properties.OnLoan = { checkbox: data.onLoan };
    }

    const response = await notion.pages.update({
      page_id: id,
      properties,
    });

    return convertNotionPageToProperty(response);
  } catch (error) {
    console.error('Error updating listing in Notion:', error);
    throw new Error('Failed to update property listing');
  }
};