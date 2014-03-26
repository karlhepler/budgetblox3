<div class="modal-content">
  <div class="modal-header">
    <h4 class="modal-title"></h4>
  </div>
  <form role="form" class="form-table">
    <div class="modal-body">
      <div class="form-group">
        <label for="amount">I received</label>
        <input type="text" class="form-control" id="amount" name="amount" placeholder="250.00" pattern="^\$?\d{1,3}(,?\d{3})*(\.\d{1,2})?$" required autofocus>
        <label for="contact">from</label>
        <div id="contact-typeahead"></div>
      </div>
      <div class="form-group">
        <label for="desc">for</label>
        <input type="text" class="form-control" id="desc" name="desc" placeholder="absolutely no reason #tagme">
      </div>
      <div class="form-group">
        <label for="bank">which I deposited into</label>
        <div id="bank-typeahead"></div>
        <label for="date"><button type="button" id="btn-date" class="btn btn-google"><span class="glyphicon glyphicon-calendar"></span></button> on</label>
        <input type="text" class="form-control" id="date" name="date" placeholder="1/31, Tuesday, ..." required>
      </div>
    </div>

    <div class="modal-footer">
      <div class="btn-group btn-group-justified">
        <div class="btn-group">
          <button type="button" class="btn btn-google" data-dismiss="modal">Cancel</button>
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-google">Save Changes</button>
        </div>
      </div>
    </div>
  </form>  
</div>