const mockData = {
    message: "This is mock data",
    success: true,
    data: [{ id: 1, name: "Test" }, { id: 2, name: "Mock" }]
  };

  (globalThis as any).fetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {

    const mockResponse = JSON.stringify(mockData);
  
    return new Response(mockResponse, {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json"
      }
    });
  };