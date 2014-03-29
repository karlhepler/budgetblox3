<div class="modal-content">
  <div class="modal-header">
    <h4 class="modal-title"></h4>
  </div>
  <form role="form" class="form-table">
    <div class="modal-body">

      <div class="form-group">
        <label for="name">I opened an account at</label>
        <input type="text" class="form-control" id="name" name="name" placeholder="Cash Box, Big Bank Company..." required autofocus>
      </div>

      <div class="form-group">
        <label for="date"><button type="button" id="btn-date" class="btn btn-google"><span class="glyphicon glyphicon-calendar"></span></button>on</label>
        <input type="text" class="form-control" name="dateOpened" id="date" placeholder="1/31, Tuesday..." required>
        <label for="amount">starting with</label>
        <input type="text" class="form-control" name="openingBalance" id="amount" placeholder="300.00" pattern="^\$?\d{1,3}(,?\d{3})*(\.\d{1,2})?$" required>
      </div>

    </div>
    
    <!-- Hidden input for priority just so it shows up in the serialization -->
    <input type="hidden" name="priority" value="0">

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