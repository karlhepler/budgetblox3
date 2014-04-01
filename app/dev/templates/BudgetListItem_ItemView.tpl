<tr>
  <td style="position:relative;">
    <div class="handle">
      <div class="grippy"></div>
      <input type="checkbox">
    </div>  	
  	<div class="info-block">      
  		<div class="h4"><%= name %></div>
  		<div class="desc">
        <span class="budget-limit-text"><%= limit %></span>
        <% if ( goal !== null ) { %>
          <span class="fancy">of</span><span class="budget-goal-text"><%= goal %></span>
        <% } %>
        <% if ( dueDate !== null ) { %>
          <span class="fancy">by</span><span class="budget-dueDate-text"><%= dueDate %></span>
        <% } %>
      </div>
  	</div>
  </td>
  <td>
  		<span class="bg-color-orange fund-icon"><%= balance %></span>
  </td>
</tr>