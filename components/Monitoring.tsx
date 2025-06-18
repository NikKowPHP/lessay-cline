import React, { useEffect, useState } from 'react';
import { Faro, captureError, captureEvent } from '@grafana/faro-web-sdk';

const Monitoring: React.FC = () => {
  const [metrics, setMetrics] = useState(null);
  const [errorRate, setErrorRate] = useState(0);
  const [responseTime, setResponseTime] = useState(0);

  useEffect(() => {
    // Initialize Faro
    Faro.initialize({
      url: '/api/faro',
      app: {
        name: 'Lessay',
        version: '1.0.0',
      },
    });

    // Fetch metrics
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const text = await response.text();
        setMetrics(text);
      } catch (error) {
        captureError(error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (metrics) {
      // Parse metrics to extract error rate and response time
      const errorRateMatch = metrics.match(/http_requests_total{status_code="5.."}(?:.*?)(\d+(\.\d+)?)/);
      const responseTimeMatch = metrics.match(/http_response_time_seconds_sum(?:.*?)(\d+(\.\d+)?)/);

      if (errorRateMatch) {
        setErrorRate(parseFloat(errorRateMatch[1]));
      }

      if (responseTimeMatch) {
        setResponseTime(parseFloat(responseTimeMatch[1]));
      }
    }
  }, [metrics]);

  return (
    <div className="monitoring-dashboard">
      <h1>System Monitoring</h1>
      <div className="metrics-card">
        <h2>Error Rate</h2>
        <p>{errorRate.toFixed(2)}%</p>
      </div>
      <div className="metrics-card">
        <h2>Average Response Time</h2>
        <p>{responseTime.toFixed(2)} seconds</p>
      </div>
      <div className="metrics-card">
        <h2>Raw Metrics</h2>
        <pre>{metrics}</pre>
      </div>
    </div>
  );
};

export default Monitoring;