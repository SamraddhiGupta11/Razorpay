# ReviveAI Machine Learning Specification

## 1. Zero Data Leakage Architecture
A common flaw in cart abandonment systems is feeding future outcome variables into predictive models. ReviveAI enforces a strict temporal barrier:

* **Session Input Vector ($X$)**: Contains only telemetry recorded *before* session termination:
  * `cart_value`, `shipping_cost`, `shipping_ratio`
  * `payment_attempts`, `payment_failed`, `technical_errors`
  * `time_on_checkout_min`, `product_views`, `coupon_views`
  * `customer_segment`, `previous_orders`, `previous_abandonments`, `is_returning`
  * `device`, `payment_method`, `hour_of_day`, `day_of_week`
* **Quarantined Outcomes ($Y$)**: Never accessible to the feature matrix:
  * `recovered`, `recovery_channel`, `recommended_action`, `recovered_revenue`, `intervention_cost`, `discount_cost`, `recovered_profit`.

## 2. Model 1: Abandonment Prediction
* **Objective**: Predict whether a checkout session drops off.
* **Algorithms Evaluated**: HistGradientBoostingClassifier vs RandomForestClassifier.
* **Selected Model**: HistGradientBoostingClassifier (ROC-AUC: 0.7767, Precision: 0.7435).

## 3. Model 2: Recovery Elasticity Prediction
* **Objective**: Predict conversion likelihood of an abandoned customer when re-engaged.
* **Population**: Filtered solely to dropped checkouts ($abandoned = 1$).
* **Algorithms Evaluated**: HistGradientBoostingClassifier vs RandomForestClassifier.
* **Selected Model**: RandomForestClassifier (ROC-AUC: 0.6282, F1: 0.6372).

## 4. Reason Diagnostic Engine
Evaluates numerical friction thresholds across 6 core root causes:
* **SHIPPING**: Shipping-to-cart ratio $> 8\%$ or shipping fee $> ₹149$ on small cart.
* **PAYMENT**: Payment gateway decline flag or $\ge 2$ payment attempts.
* **PRICE**: $\ge 3$ coupon searches with price dwell.
* **TECHNICAL**: Frontend JavaScript or timeout errors $> 0$.
* **HESITATION**: Dwell time $> 7$ minutes without errors.
* **TRUST**: First-time buyer on large cart size avoiding online prepayments.

## 5. Explainable AI (XAI)
Implements local feature attribution for predictions (PREDICT $\to$ EXPLAIN $\to$ DECIDE), detailing positive drivers (e.g. VIP loyalty +22%, prior orders +18%) and negative risk drags (payment failure -15%, ticket size -6%).
