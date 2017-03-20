---
---
### Calculate How Much You Are Losing

To know your organization's exact numbers, fill out this form:

<form id="retention-form">
  <label for="last_year_donations">Last Year Donations or Average Donation</label>
  <input type="text" id="donations" name="last_year_donations" placeholder="Last Year donations" />
  -- or --
  <input type="text" id="avg-donations" name="avg_last_year_donations" placeholder="Average Last Year donations" />
  <br/>
  <label for="last_year_dononor">Last Year Donors</label>
  <input type="text" id="last-year-donors" name="last_year_donors" placeholder="Last Year donors" />
  <br/>
  <label for="this_year_dononor">This Year Donors</label>
  <input type="text" id="this-year-donors" name="this_year_donors" placeholder="this Year donors" />
  <br/>
  <label for="retained-donors">Retained Donors or New Donors this year</label>
  <input type="text" id="retained-donors" name="this_year_donors" placeholder="retained" />
  -- or --
  <input type="text" id="this-year-new-donors" name="this_year_new_donors" placeholder="New donors this year" />
  <br/>
  <button id="calculate-form">Calculate</button>
</form>
You could be losing out on <span id="lost-dollars">$14,000</span> .
Your Retention rate is: <span id="retention-rate"></span>%
