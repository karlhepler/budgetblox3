<div class="modal-content">
  <div class="modal-header">
    <h4 class="modal-title"></h4>
  </div>
  <form role="form" class="form-table">
    <div class="modal-body">
      <div class="form-group">
        <label for="limit">I need</label>
        <input type="text" class="form-control" id="limit" name="limit" placeholder="250.00" pattern="^\$?\d{1,3}(,?\d{3})*(\.\d{1,2})?$" required autofocus>
        <label for="name">for</label>
        <input type="text" class="form-control" id="name" name="name" placeholder="Groceries, Cable Bill, ..." required>
      </div>
      <h5>Additional Options</h5>
      <br><br>
      <div class="form-group">
        <label for="dueDate"><button type="button" id="btn-date" class="btn btn-google"><span class="glyphicon glyphicon-calendar"></span></button> I need it by</label>
        <input type="text" class="form-control" id="dueDate" name="dueDate" placeholder="1/31, Tuesday, ...">
      </div>

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

<!-- Repeat chooser -->
<!-- <div class="panel-group" id="accordion">
  <div class="panel panel-default">
    <div class="panel-heading">
      <div class="panel-title clearfix">
        <h6 class="pull-left">Repeats</h6>
        <div class="btn-group pull-right">
          <button type="button" class="active btn btn-default">NO</button>
          <button type="button" class="btn btn-default">YES</button>
        </div>
      </div>
    </div>
    <div id="repeat-collapse" class="panel-collapse collapse">
      <div class="panel-body">
        
        <div class="form-group">
          <label for="interval">every</label>
          <select class="form-control" name="interval" id="interval">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
          </select>
          
          FREQUENCY
          <label style="padding:5px;"></label>
          <select id="frequency" class="form-control" name="frequency">
            <option value="days" title="days">days</option>
            <option value="weeks" title="weeks">weeks</option>
            <option value="months" title="months">months</option>
            <option value="years" title="years">years</option>
          </select>

        </div>

        <div class="form-group">
          <label for="bymonth">in</label>
          <select name="bymonth" multiple id="bymonth" class="form-control" title="every month">
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

          <label for="byweekday">on</label>
          <select name="byweekday" multiple id="byweekday" class="form-control" title="every weekday">
            <option value="sun">Sunday</option>
            <option value="mon">Monday</option>
            <option value="tue">Tuesday</option>
            <option value="wed">Wednesday</option>
            <option value="thu">Thursday</option>
            <option value="fri">Friday</option>
            <option value="sat">Saturday</option>
          </select>
        </div>

        <div class="form-group">
          <label for="until"><span id="btn-date" class="btn btn-google"><span class="glyphicon glyphicon-calendar"></span></span> until</label>
          <input type="text" class="form-control" id="until" name="until" placeholder="time stops">
        </div>

      </div>
    </div>
  </div>
</div> -->