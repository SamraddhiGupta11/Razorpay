# ReviveAI System Architecture

## Overview
ReviveAI is built as a **production-oriented prototype** designed for e-commerce revenue recovery. The platform connects real-time checkout drop-off signals to machine learning diagnostics, local explainability, and an economic decision engine.

```mermaid
flowchart TD
    subgraph ECommerce ["E-Commerce & Storefront"]
        CS["Customer Starts Checkout"]
        DROP["Cart Abandonment Occurs"]
    end

    subgraph DataPlatform ["Data Ingestion & Persistence"]
        DB[("PostgreSQL 18")]
        Tables["customers | checkout_sessions | abandoned_carts | interventions | conversions"]
    end

    subgraph MLEngine ["ML & Decision Layer"]
        M1["Model 1: Abandonment Prediction (HistGradientBoosting / RF)"]
        RE["Diagnostic Reason Engine (with Evidence Signals)"]
        M2["Model 2: Recovery Elasticity (RandomForest / GBDT)"]
        XAI["Explainability Engine (XAI Attribution Weights)"]
        DE["Decision Engine (Profit Maximization & NBA)"]
    end

    subgraph Execution ["Autonomous Intervention"]
        CH["Delivery Channels: WhatsApp | SMS | Email"]
        STATE["Lifecycle State Machine: Sent -> Opened -> Resumed -> Converted"]
    end

    CS --> DROP
    DROP --> DB
    DB --> M1
    M1 --> RE
    RE --> M2
    M2 --> XAI
    XAI --> DE
    DE --> CH
    CH --> STATE
    STATE --> DB
```

---

## Key Modules
1. **Zero-Leakage Feature Extraction**: Features are strictly partitioned into pre-abandonment session attributes and quarantined post-intervention outcomes.
2. **Diagnostic Reason Engine**: Identifies primary cause (`SHIPPING`, `PAYMENT`, `PRICE`, `TECHNICAL`, `HESITATION`, `TRUST`) with quantitative telemetry evidence.
3. **Local Explainable AI (XAI)**: Attributes positive conversion drivers and risk drag factors explaining the predicted recovery probability.
4. **Economic Decision Engine**: Evaluates expected revenue, discount concessions, delivery costs, and expected profit for all 7 candidate actions to pick the profit-maximizing Next Best Action.
