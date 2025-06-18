import { describe, it, expect } from '@jest/globals'
import { POST } from '@/app/api/payments/create-subscription/route'
import { NextRequest } from 'next/server'

// Mock the Stripe library
const mockStripe = {
  subscriptions: {
    create: jest.fn()
  }
}

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => mockStripe)
})

describe('Payment Processing - Subscription Creation', () => {
  it('should create a valid subscription', async () => {
    // Mock successful response
    mockStripe.subscriptions.create.mockResolvedValueOnce({
      id: 'sub_123',
      customer: 'cust_123',
      status: 'active',
      items: {
        data: [
          {
            price: {
              id: 'price_123'
            }
          }
        ]
      }
    })

    const request = new NextRequest(JSON.stringify({
      customerId: 'cust_123',
      priceId: 'price_123'
    }))

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.subscription).toBeDefined()
    expect(result.subscription.id).toBe('sub_123')
    expect(result.subscription.customer).toBe('cust_123')
    expect(result.subscription.items.data.length).toBeGreaterThan(0)
    expect(result.subscription.items.data[0].price.id).toBe('price_123')
  })

  it('should handle errors during subscription creation', async () => {
    // Mock error response
    mockStripe.subscriptions.create.mockRejectedValueOnce(new Error('Test error'))

    const request = new NextRequest(JSON.stringify({
      customerId: 'cust_123',
      priceId: 'price_123'
    }))

    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(500)
    expect(result.error).toBe('Subscription creation failed')
  })
})