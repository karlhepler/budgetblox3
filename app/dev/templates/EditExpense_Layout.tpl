<div class="modal-content">
  <div class="modal-header">
    <h4 class="modal-title"></h4>
  </div>
  <form role="form" class="form-table">
    <div class="modal-body">
      <div class="form-group">
        <label for="amount">I spent</label>
        <input type="text" class="form-control" id="amount" name="amount" placeholder="250.00" pattern="^\$?\d{1,3}(,?\d{3})*(\.\d{1,2})?$" required autofocus>
        <label for="budget">from</label>
        <div id="budget-typeahead"></div>
        <label for="contact">at</label>
        <div id="contact-typeahead"></div>
      </div>
      <div class="form-group">
        <label for="date"><button type="button" id="btn-date" class="btn btn-google"><span class="glyphicon glyphicon-calendar"></span></button> on</label>
        <input type="text" class="form-control" id="date" name="date" placeholder="1/31, Tuesday, ..." required>
        <label for="desc">for</label>
        <input type="text" class="form-control" id="desc" name="desc" placeholder="absolutely no reason #tagme">
      </div>    

      <h5>Additional Options</h5>
      <br><br>

      <!-- Banks chooser -->
      <div class="panel-group" id="accordion">
        <div class="panel panel-default">
          <div class="panel-heading">
            <div class="panel-title clearfix">
              <h6 id="banks-panel-title" class="pull-left">Banks</h6>
              <div class="btn-group pull-right" data-toggle="buttons">
                <label class="btn btn-default btn-hide-panel active">
                  <input type="radio" name="showBanks" value="false" class="btn btn-default btn-hide-panel" checked>
                  DEFAULT
                </label>                
                <label class="btn btn-default btn-hide-panel">
                  <input type="radio" name="showBanks" value="true" class="btn btn-default btn-show-panel">
                  CUSTOM
                </label>                
              </div>
            </div>
          </div>
          <div id="bank-collapse" class="panel-collapse collapse">
            <div class="panel-body">
              <table class="preferred-bank-list-region table"></table>
            </div>
          </div>
        </div>
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