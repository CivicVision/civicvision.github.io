(function() {
  this.Donors = (function() {
    function Donors(options) {
      var ref, ref1, ref2, ref3, ref4;
      if (options == null) {
        options = {};
      }
      this.years = options.years, this.base_rate = options.base_rate, this.retention_rates = options.retention_rates, this.average_donation = options.average_donation, this.donors = options.donors;
      this.years = (ref = options.years) != null ? ref : 5;
      this.base_rate = (ref1 = options.base_rate) != null ? ref1 : 46;
      this.retention_rates = (ref2 = options.retention_rates) != null ? ref2 : [47, 51, 56, 66];
      this.average_donation = (ref3 = options.average_donation) != null ? ref3 : 104;
      this.donors = (ref4 = options.donors) != null ? ref4 : 13500;
    }

    Donors.prototype.setAverageDonation = function(avgDonation) {
      return this.average_donation = avgDonation;
    };

    Donors.prototype.calculate_donors = function(year, retention_rate) {
      return Math.floor(Math.pow(retention_rate / 100, year - 1) * this.donors);
    };

    Donors.prototype.calculate_numbers = function(year, group, retention_rate, base) {
      var additional, donors;
      if (year == null) {
        year = 1;
      }
      if (group == null) {
        group = 0;
      }
      if (retention_rate == null) {
        retention_rate = 46;
      }
      donors = this.calculate_donors(year, retention_rate);
      additional = (donors - base[year - 1]) * this.average_donation;
      return {
        year: year,
        group: group,
        retention_rate: retention_rate,
        donors: donors,
        additional: additional,
        additional_sum: additional
      };
    };

    Donors.prototype.calculate_years = function(group, retention_rate, base) {
      var year, yearNumbers;
      yearNumbers = (function() {
        var j, ref, results;
        results = [];
        for (year = j = 1, ref = this.years; 1 <= ref ? j <= ref : j >= ref; year = 1 <= ref ? ++j : --j) {
          results.push(this.calculate_numbers(year, group, retention_rate, base));
        }
        return results;
      }).call(this);
      return yearNumbers.map(function(d, i) {
        if (i > 0) {
          d.additional_sum = d.additional + yearNumbers[i - 1].additional_sum;
        }
        return d;
      });
    };

    Donors.prototype.calculate = function() {
      var base, i, j, len, ref, results, retention_rate, year;
      base = (function() {
        var j, ref, results;
        results = [];
        for (year = j = 1, ref = this.years; 1 <= ref ? j <= ref : j >= ref; year = 1 <= ref ? ++j : --j) {
          results.push(this.calculate_donors(year, this.base_rate));
        }
        return results;
      }).call(this);
      ref = this.retention_rates;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        retention_rate = ref[i];
        results.push(this.calculate_years(i, retention_rate, base));
      }
      return results;
    };

    return Donors;

  })();

}).call(this);
