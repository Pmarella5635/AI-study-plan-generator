/**
 * Formats API responses consistently
 */
const formatResponse = (success, data = null, message = null) => {
    const response = {
      success: success
    };
  
    if (data) {
      response.data = data;
    }
  
    if (message) {
      response.message = message;
    }
  
    return response;
  };
  
  /**
   * Success response formatter
   */
  const success = (data = null, message = null) => {
    return formatResponse(true, data, message);
  };
  
  /**
   * Error response formatter
   */
  const error = (message = 'An error occurred', errorDetails = null) => {
    const response = formatResponse(false, null, message);
    
    if (errorDetails && process.env.NODE_ENV !== 'production') {
      response.error = errorDetails;
    }
    
    return response;
  };
  
  module.exports = {
    formatResponse,
    success,
    error
  };