library(shiny)

ui <- fluidPage(
  titlePanel("ANALISIS VARIANS (ANOVA)"),
  sidebarLayout(
    sidebarPanel(
      fileInput("file1", "Upload Dataset (CSV)",
                accept = c("text/csv", "text/comma-separated-values,text/plain", ".csv")),
      uiOutput("columns"),
      actionButton("run_anova", "Jalankan ANOVA"),
      hr(),
      h3("Hasil ANOVA"),
      verbatimTextOutput("anova_summary")
    ),
    mainPanel(
      tabsetPanel(
        tabPanel("Dataset", tableOutput("data_table")),
        tabPanel("Boxplot", plotOutput("boxplot")),
        tabPanel("Residual Plot", plotOutput("residual_plot")),
        tabPanel("ANOVA Table", tableOutput("anova_table"))
      )
    )
  )
)

server <- function(input, output, session) {
  dataset <- reactive({
    req(input$file1)
    read.csv(input$file1$datapath)
  })
  
  output$data_table <- renderTable({
    req(dataset())
    head(dataset(), 10)
  })
  
  output$columns <- renderUI({
    req(dataset())
    tagList(
      selectInput("response_var", "Variabel Respon (Numerik)", 
                  choices = names(dataset())),
      selectInput("factor_var", "Variabel Faktor (Kategorikal)", 
                  choices = names(dataset()))
    )
  })
  
  result_anova <- eventReactive(input$run_anova, {
    req(input$response_var, input$factor_var)
    data <- dataset()
    formula <- as.formula(paste(input$response_var, "~", input$factor_var))
    aov(formula, data = data)
  })
  
  output$anova_summary <- renderPrint({
    req(result_anova())
    summary(result_anova())
  })
  
  output$boxplot <- renderPlot({
    req(dataset(), input$response_var, input$factor_var)
    data <- dataset()
    boxplot(data[[input$response_var]] ~ data[[input$factor_var]],
            main = "Boxplot ANOVA",
            xlab = "Faktor",
            ylab = "Respon",
            col = "#00726B")
  })
  
  output$residual_plot <- renderPlot({
    req(result_anova())
    residuals <- resid(result_anova())
    fitted <- fitted(result_anova())
    plot(fitted, residuals,
         main = "Residual Plot",
         xlab = "Fitted Values",
         ylab = "Residuals",
         pch = 19, col = "blue")
    abline(h = 0, lty = 2, col = "red")
  })
  
  output$anova_table <- renderTable({
    req(result_anova())
    anova_table <- summary(result_anova())[[1]]
    data.frame(
      Df = anova_table[, "Df"],
      "Sum Sq" = anova_table[, "Sum Sq"],
      "Mean Sq" = anova_table[, "Mean Sq"],
      "F value" = anova_table[, "F value"],
      "Pr(>F)" = anova_table[, "Pr(>F)"]
    )
  })
}

shinyApp(ui, server)
