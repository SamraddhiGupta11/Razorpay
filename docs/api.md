# ReviveAI REST API Specification

## Base URL
`/api`

## Endpoints

### 1. System Health
* **`GET /api/health`**
  * Description: Validates server status, PostgreSQL connection ping, and ML model availability.
  * Response: `{ "status": "healthy", "service": "ReviveAI", "database": {"status": "healthy"} }`

### 2. Executive Analytics
* **`GET /api/dashboard/summary`**
  * Description: Fetches real-time KPIs aggregated directly from PostgreSQL.
  * Response: `total_checkouts`, `abandoned_checkouts`, `revenue_at_risk`, `revenue_recovered`, `net_recovered_profit`, `recovery_rate_pct`, `overall_roi_pct`.
* **`GET /api/dashboard/charts`**
  * Description: Returns chart datasets for reasons breakdown, customer segments, channel efficiency matrix, and conversion funnel.

### 3. Machine Learning & Decision Intelligence
* **`POST /api/predict/abandonment`**
  * Description: Model 1 inference for abandonment probability.
* **`POST /api/predict/recovery`**
  * Description: Model 2 inference for recovery likelihood.
* **`POST /api/predict/reason`**
  * Description: Diagnostic Reason Engine with evidence signals and friction scores.
* **`POST /api/recommend-action`**
  * Description: Complete pipeline (Detect $\to$ Diagnose $\to$ Predict $\to$ Explain $\to$ Decide Next Best Action with full comparison matrix).

### 4. Checkouts & Customers
* **`GET /api/checkouts/abandoned`**
  * Query parameters: `limit`, `offset`, `reason`, `segment`, `min_cart`, `sort_by`.
* **`GET /api/customers`**
  * Query parameters: `limit`, `offset`, `segment`, `search`.
* **`GET /api/customers/{customer_id}`**
  * Description: Detailed profile with lifetime spend, drop-off history, and recent sessions.

### 5. Interventions & Simulation
* **`GET /api/interventions`**
  * Query parameters: `limit`, `status`, `channel`.
* **`POST /api/interventions/{id}/execute`**
  * Description: Simulates customer conversion lifecycle, updates abandoned cart status, inserts conversion record in PostgreSQL.

### 6. Simulator & Demos
* **`POST /api/simulator/evaluate`**
  * Description: Real-time calculation of recovered revenue and net margin across merchant assumptions.
* **`GET /api/ab-testing/summary`**
  * Description: Multi-arm trial comparing Control vs Static Email vs Discounts vs ReviveAI NBA.
* **`GET /api/demo/scenarios`**
  * Description: 5 predefined pitch demonstration scenarios.
