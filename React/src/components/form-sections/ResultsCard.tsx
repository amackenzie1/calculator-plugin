import ProjectionGraph from "@/components/ProjectionGraph"; // Import the dedicated graph component
import { CalculatorSchemaType } from "@/lib/schema/calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ProjectionDataPoint, YearState } from "@/lib/calculator/projection"; // Assuming YearState is exported
import { calculateSurplusCapital, SurplusCalculationResult } from "@/lib/calculator/projection/surplus";
import { generateExcelReport } from "@/lib/generateExcelReport"; // Ensure this is a static import for now
import { DownloadIcon, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { SurplusCapitalCard } from "@/components/SurplusCapitalCard";

export interface ResultsCardProps {
  projectionData: ProjectionDataPoint[];
  calculatorInput?: CalculatorSchemaType;
  detailedProjectionStates: YearState[];
}

const ResultsCard: React.FC<ResultsCardProps> = ({ 
  projectionData, 
  calculatorInput, 
  detailedProjectionStates 
}) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [surplusResult, setSurplusResult] = useState<SurplusCalculationResult | undefined>();
  const [isCalculatingSurplus, setIsCalculatingSurplus] = useState(false);

  // Calculate surplus capital when calculatorInput changes
  useEffect(() => {
    if (!calculatorInput) {
      setSurplusResult(undefined);
      return;
    }

    setIsCalculatingSurplus(true);
    
    // Run calculation async to avoid blocking UI
    const calculateAsync = async () => {
      try {
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const result = calculateSurplusCapital(calculatorInput);
        setSurplusResult(result);
      } catch (error) {
        console.error("Error calculating surplus capital:", error);
        setSurplusResult(undefined);
      } finally {
        setIsCalculatingSurplus(false);
      }
    };

    calculateAsync();
  }, [calculatorInput]);

  const handleDownloadXLSX = async () => {
    console.log("[ResultsCard] handleDownloadXLSX triggered");

    if (!calculatorInput || !detailedProjectionStates || detailedProjectionStates.length === 0) {
      console.error("[ResultsCard] Data not available for Excel export. Input valid:", !!calculatorInput, "States valid:", !!detailedProjectionStates, "States length:", detailedProjectionStates?.length);
      toast({
        title: "Export Error",
        description: "Projection data is not available for export. Please calculate first.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("[ResultsCard] Data seems available. Proceeding to generate report.");
    setIsDownloading(true);

    try {
      // Use post-donation data if available and there's surplus
      const hasSurplus = surplusResult && surplusResult.surplusCapital > 0;
      
      const dataToExport = hasSurplus && surplusResult.postDonationProjection
        ? surplusResult.postDonationProjection
        : detailedProjectionStates;
      
      const inputToExport = hasSurplus && surplusResult.postDonationInput
        ? surplusResult.postDonationInput
        : calculatorInput;
      
      const filename = hasSurplus
        ? `Projection_After_${Math.round(surplusResult.surplusCapital / 1000)}k_Donation.xlsx`
        : "FinancialProjection.xlsx";
      
      console.log("[ResultsCard] Attempting to call generateExcelReport with:", { 
        statesCount: dataToExport.length,
        hasInput: !!inputToExport,
        filename
      });
      await generateExcelReport(dataToExport, inputToExport, filename);
      console.log("[ResultsCard] Excel report generation call completed.");
      toast({
        title: "Export Successful",
        description: "Your XLSX report has been downloaded.",
        variant: "default",
      });
    } catch (error) {
      console.error("[ResultsCard] Error during generateExcelReport call:", error);
      toast({
        title: "Export Failed",
        description: "Could not generate the XLSX report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">Financial Projection Results</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Your retirement projection and charitable giving capacity analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Surplus Capital Analysis - now includes the projection graph */}
        {calculatorInput && projectionData.length > 0 ? (
          <SurplusCapitalCard 
            surplusResult={surplusResult} 
            isCalculating={isCalculatingSurplus}
            originalProjectionData={projectionData}
          />
        ) : (
          <p className="text-center text-muted-foreground">No projection data available. Please complete the previous steps and calculate.</p>
        )}
        <div className="flex justify-center mt-6">
          <Button onClick={handleDownloadXLSX} variant="default" size="lg" className="flex items-center gap-2" disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <DownloadIcon size={18} />
            )}
            {isDownloading ? "Generating Report..." : "Download XLSX Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard; 